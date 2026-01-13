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
		res.render("index", {imgFile: imgFile, imgAlt: imgAlt});
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
			res.render("genlist", {heading: "Valik Eesti vanasAænu", listData: ["Ei leidnud A¬htegi vanasAæna!"]});
		} else {
			folkWisdom = data.split(";");
			res.render("genlist", {heading: "Valik Eesti vanasAænu", listData: folkWisdom});
		}
	});
});

const visitlogRoute = require("./routes/visitlogRoute");
app.use("/visitlog", visitlogRoute);

const eestifilmRoute = require("./routes/eestifilmRoute");
app.use("/eestifilm", eestifilmRoute);

const galleryphotouploadRoute = require("./routes/galleryphotouploadRoute");
app.use("/galleryphotoupload", galleryphotouploadRoute);

app.listen(5332);
