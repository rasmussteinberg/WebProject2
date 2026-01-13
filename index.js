const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const dateET = require("./src/dateTimeET");
const visitFile = "./public/txt/visitlog.txt";
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
const vanasonaFile = "./public/txt/vanasonad.txt";
const mysql = require("mysql2/promise");
const dbInfo = require("./vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

app.get("/", async (req, res)=>{
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		const sqlReq = "SELECT filename, alttext FROM galleryphotos_aa WHERE id=(SELECT MAX(id) FROM galleryphotos_aa WHERE privacy=? AND deleted IS NULL)";
		const privacy = 3;
		const [rows] = await conn.execute(sqlReq, [privacy]);
		let imgFile;
		let imgAlt = "Avalik foto";
		if (rows.length > 0) {
			imgFile = "/gallery/normal/" + rows[0].filename;
			if (rows[0].alttext) {
				imgAlt = rows[0].alttext;
			}
		}
		const newsReq = "SELECT title, content, expire, created_at FROM news WHERE expire >= CURDATE() ORDER BY created_at DESC LIMIT 1";
		const [newsRows] = await conn.execute(newsReq);
		const latestNews = newsRows.length > 0 ? newsRows[0] : null;
		res.render("index", {imgFile: imgFile, imgAlt: imgAlt, latestNews: latestNews});
	}
	catch(err){
		res.render("index");
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiuhendus suletud!");
		}
	}
});

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateET.weekDay();
	const dateNow = dateET.fullDate();
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow});
});

app.get("/vanasonad", (req, res)=>{
	let folkWisdom = [];
	fs.readFile(vanasonaFile, "utf8", (err, data)=>{
		if(err){
			res.render("genlist", {heading: "Valik Eesti vanasõnu", listData: ["Ei leidnud ühtegi vanasõna!"]});
		} else {
			folkWisdom = data.split(";");
			res.render("genlist", {heading: "Valik Eesti vanasõnu", listData: folkWisdom});
		}
	});
});

const visitlogRoute = require("./routes/visitlogRoute");
app.use("/visitlog", visitlogRoute);

const eestifilmRoute = require("./routes/eestifilmRoute");
app.use("/eestifilm", eestifilmRoute);

const galleryphotouploadRoute = require("./routes/galleryphotouploadRoute");
app.use("/galleryphotoupload", galleryphotouploadRoute);

const galleryRoute = require("./routes/galleryRoutes");
app.use("/gallery", galleryRoute);

const photogalleryRoute = require("./routes/photogalleryRoutes");
app.use("/photogallery", photogalleryRoute);

const newsRoute = require("./routes/newsRoutes");
app.use("/news", newsRoute);

const signupRoute = require("./routes/signupRoutes");
app.use("/signup", signupRoute);

app.listen(5332);
