const mysql = require("mysql2/promise");
const dbInfo = require("../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

const galleryPage = async (req, res)=>{
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		const sqlReq = "SELECT filename, alttext FROM galleryphotos_aa WHERE privacy >= ? AND deleted IS NULL";
		const privacy = 2;
		const [rows] = await conn.execute(sqlReq, [privacy]);
		const galleryData = rows.map((row)=>{
			const altText = row.alttext ? row.alttext : "Galeriipilt";
			return {href: row.filename, alt: altText};
		});
		res.render("gallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/"});
	}
	catch(err) {
		console.log(err);
		res.render("gallery", {galleryData: [], imagehref: "/gallery/thumbs/"});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("DB suletud");
		}
	}
};

module.exports = {
	galleryPage
};
