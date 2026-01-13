const mysql = require("mysql2/promise");
const dbInfo = require("../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

const photogalleryHome = async (req, res)=>{
	res.redirect("/photogallery/1");
};

const photogalleryPage = async (req, res)=>{
	let conn;
	const photoLimit = 5;
	const privacy = 2;
	let page = parseInt(req.params.page, 10);
	let skip = 0;

	try {
		conn = await mysql.createConnection(dbConf);
		const countReq = "SELECT COUNT(id) AS photos FROM galleryphotos_aa WHERE privacy >= ? AND deleted IS NULL";
		const [countResult] = await conn.execute(countReq, [privacy]);
		const photoCount = countResult[0].photos;

		if(page < 1 || isNaN(page)){
			page = 1;
		}
		if((page - 1) * photoLimit >= photoCount){
			page = Math.max(1, Math.ceil(photoCount / photoLimit));
		}

		let galleryLinks;
		if(page === 1){
			galleryLinks = "Eelmine leht &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;";
		} else {
			galleryLinks = `<a href="/photogallery/${page - 1}">Eelmine leht</a> &nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;`;
		}
		if(page * photoLimit >= photoCount){
			galleryLinks += "Järgmine leht";
		} else {
			galleryLinks += `<a href="/photogallery/${page + 1}">Järgmine leht</a>`;
		}

		const sqlReq = "SELECT filename, alttext FROM galleryphotos_aa WHERE privacy >= ? AND deleted IS NULL LIMIT ?,?";
		skip = (page - 1) * photoLimit;
		const [rows] = await conn.execute(sqlReq, [privacy, skip, photoLimit]);
		const galleryData = rows.map((row)=>{
			const altText = row.alttext ? row.alttext : "Galeriipilt";
			return {src: row.filename, alt: altText};
		});
		res.render("photogallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/", links: galleryLinks});
	}
	catch(err) {
		console.log(err);
		res.render("photogallery", {galleryData: [], imagehref: "/gallery/thumbs/", links: ""});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
	}
};

module.exports = {
	photogalleryHome,
	photogalleryPage
};
