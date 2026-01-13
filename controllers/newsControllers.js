const mysql = require("mysql2/promise");
const dbInfo = require("../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

const newsHome = (req, res)=>{
	return newsListPage(req, res);
};

const addNewsPage = (req, res)=>{
	res.render("addnews", {notice: ""});
};

const addNewsPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	try {
		conn = await mysql.createConnection(dbConf);
		if(!req.body.titleInput || !req.body.newsInput || !req.body.expireInput){
			return res.render("addnews", {notice: "Andmeid on puudu!"});
		}
		const sqlReq = "INSERT INTO news (title, content, expire, photofilename, alttext, userid) VALUES (?,?,?,?,?,?)";
		const photoFilename = req.file ? req.file.filename : null;
		const altText = req.body.altInput ? req.body.altInput : null;
		const userId = 1;
		await conn.execute(sqlReq, [
			req.body.titleInput,
			req.body.newsInput,
			req.body.expireInput,
			photoFilename,
			altText,
			userId
		]);
		res.render("addnews", {notice: "Uudis salvestatud!"});
	}
	catch(err) {
		console.log(err);
		res.render("addnews", {notice: "Tehniline viga"});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiuhendus suletud!");
		}
	}
};

const newsListPage = async (req, res)=>{
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		const sqlReq = "SELECT title, content, expire, photofilename, alttext, created_at FROM news WHERE expire >= CURDATE() ORDER BY created_at DESC";
		const [rows] = await conn.execute(sqlReq);
		res.render("news", {newsList: rows});
	}
	catch(err) {
		console.log(err);
		res.render("news", {newsList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiuhendus suletud!");
		}
	}
};

module.exports = {
	newsHome,
	addNewsPage,
	addNewsPagePost,
	newsListPage
};
