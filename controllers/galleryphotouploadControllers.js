const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../vp2025config");
const watermarkFile = "./public/images/vp_logo_small.png";

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

const galleryphotouploadPage = (req, res)=>{
	res.render("galleryphotoupload");
};

const galleryphotouploadPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	console.log(req.file);
	try {
		const fileName = "vp_" + Date.now() + ".jpg";
		console.log(fileName);
		await fs.rename(req.file.path, req.file.destination + fileName);
		const watermarkSettings = [{
			input: watermarkFile,
			gravity: "southeast"
		}];
		if (!await fs.access(watermarkFile).then(() => true).catch(() => false)) {
			console.log("Vesimargi faili ei leitud!");
			watermarkSettings.length = 0;
		}
		console.log("Muudan suurust: 800X600");
		let normalImageProcessor = sharp(req.file.destination + fileName).resize(800, 600).jpeg({quality: 90});
		console.log("Lisan vesimargi " + watermarkSettings.length);
		if (watermarkSettings.length > 0) {
			normalImageProcessor = normalImageProcessor.composite(watermarkSettings);
		}
		await normalImageProcessor.toFile("./public/gallery/normal/" + fileName);
		await sharp(req.file.destination + fileName).resize(100, 100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
		conn = await mysql.createConnection(dbConf);
		const sqlReq = "INSERT INTO galleryphotos_aa (filename, origname, alttext, privacy, userid) VALUES(?,?,?,?,?)";
		const userId = 1;
		const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
		console.log("Lisati foto id: " + result.insertId);
		res.render("galleryphotoupload");
	}
	catch(err){
		console.log(err);
		res.render("galleryphotoupload");
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiuhendus suletud!");
		}
	}
};

module.exports = {
	galleryphotouploadPage,
	galleryphotouploadPagePost
};
