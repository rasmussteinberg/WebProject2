const mysql = require("mysql2/promise");
const dbInfo = require("../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Home page for Estonian movie section
//@route GET /eestifilm
//@access public
const filmHomePage = (req, res)=>{
	res.render("eestifilm");
};

//@desc page for people involved in Estonian movie industry
//@route GET /eestifilm/inimesed
//@access public
const filmPeople = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM person";
	try {
		conn = await mysql.createConnection(dbConf);
		const [rows] = await conn.execute(sqlReq);
		res.render("filmiinimesed", {personList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("filmiinimesed", {personList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc page for adding people involved in Estonian movie industry
//@route GET /eestifilm/inimesed_add
//@access public
const filmPeopleAdd = (req, res)=>{
	res.render("filmiinimesed_add", {notice: "ootan sisestust"});
};

//@desc page for submitting people involved in Estonian movie industry
//@route POST /eestifilm/inimesed_add
//@access public
const filmPeopleAddPost = async (req, res)=>{
	let conn;
	const sqlReq = "INSERT INTO person (first_name, last_name, birth_date, death_date) VALUES (?,?,?,?)";
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.dateofbirthInput || req.body.dateofbirthInput > new Date()){
		res.render("filmiinimesed_add", {notice: "Andmeid on puudu vA\u0011i ebakorrektsed"});
		return;
	}
	try {
		conn = await mysql.createConnection(dbConf);
		let deceasedDate = null;
		if(req.body.dateofdeathInput != ""){
			deceasedDate = req.body.dateofdeathInput;
		}
		const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.dateofbirthInput, deceasedDate]);
		console.log("Salvestati kirje id: " + result.insertId);
		res.render("filmiinimesed_add", {notice: "salvestamine A\u0011nnestus"});
	}
	catch(err){
		console.log("Viga: " + err);
		res.render("filmiinimesed_add", {notice: "andmete salvestamine ebaA\u0011nnestus"});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc page for professions involved in movie industry
//@route GET /eestifilm/ametid
//@access public
const filmPosition = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM position";
	try {
		conn = await mysql.createConnection(dbConf);
		const [rows] = await conn.execute(sqlReq);
		res.render("ametid", {positionList: rows});
	}
	catch(err){
		console.log("Viga: " + err);
		res.render("ametid", {positionList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

//@desc page for adding professions involved in movie industry
//@route GET /eestifilm/ametid_add
//@access public
const filmPositionAdd = (req, res)=>{
	res.render("ametid_add", {notice: "ootan sisestust"});
};

//@desc page for submitting professions involved in movie industry
//@route POST /eestifilm/ametid_add
//@access public
const filmPositionAddPost = async (req, res)=>{
	if(!req.body.positionNameInput){
		res.render("ametid_add", {notice: "Andmeid on puudu vA\u0011i ebakorrektsed"});
		return;
	}
	let conn;
	const sqlReq = "INSERT INTO position (name, description) VALUES (?,?)";
	let positionDescription = null;
	if(req.body.descriptionInput != ""){
		positionDescription = req.body.descriptionInput;
	}
	try {
		conn = await mysql.createConnection(dbConf);
		await conn.execute(sqlReq, [req.body.positionNameInput, positionDescription]);
		res.redirect("/eestifilm/ametid");
	}
	catch(err){
		console.log("Viga: " + err);
		res.render("ametid_add", {notice: "Tekkis tehniline viga: " + err});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

module.exports = {
	filmHomePage,
	filmPeople,
	filmPeopleAdd,
	filmPeopleAddPost,
	filmPosition,
	filmPositionAdd,
	filmPositionAddPost
};
