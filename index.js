const express = require('express')
const app = express()
const fs = require("fs")
const path = require("path")
const dateET = require("./src/dateTimeET")
const visitFile = "./public/txt/visitlog.txt"
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
const vanasonaFile = "./public/txt/vanasonad.txt"
const mysql = require('mysql2')
const dbInfo = require('../../vp2025config')

const conn = mysql.createConnection({
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
});

app.get('/', (req, res) => {
	res.render('index')
})

app.get("/timenow", (req, res)=>{
	const weekDayNow = dateET.weekDay()
	const dateNow = dateET.fullDate()
	res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow})
})

app.get("/vanasonad", (req, res)=>{
	let folkWisdom = []
	fs.readFile(vanasonaFile, "utf8", (err, data)=>{
		if(err){
			res.render("genlist", {heading: "Valik Eesti vanasõnu", listData: ["Ei leidnud ühtegi vanasõna!"]})
		} else {
			folkWisdom = data.split(";")
			res.render("genlist", {heading: "Valik Eesti vanasõnu", listData: folkWisdom})
		}
	})
})

app.get("/visitlog/registervisit", (req, res)=>{
	res.render("registervisit")
})

app.post("/visitlog/registervisit", (req, res)=>{
	console.log(req.body)
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
			if(err){
				throw(err)
			} else {
				fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + " \n", (err)=>{
					if(err){
						throw(err)
					} else {
						console.log("Salvestatud!")
						res.render("registervisit")
					}
				})
			}
	})
})

app.get("/visitlog", (req, res)=>{
	let visitlog = []
	fs.readFile(visitFile, "utf8", (err, data)=>{
			if(err){
				res.render("visitlog", {heading: "Registreeritud kasutajad", listData: ["Ei leidnud ühtegi registreeritud külastust"]})
			} else {
				visitlog = data.split("\n")
				let correctListData = [];
				for(let i = 0; i < visitlog.length - 1; i ++){
					correctListData.push(visitlog[i]);
				}
				res.render("visitlog", {heading: "Registreeritud kasutajad", listData: correctListData});
			}
	})
})

app.post("/visitlog/regsuccess", (req, res)=>{
	console.log(req.body)
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
			if(err){
				throw(err)
			} else {
				fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateET.fullDate() + " kell " + dateET.fullTime() +  " \n", (err)=>{
					if(err){
						throw(err)
					} else {
						console.log("Registreerimine edukas!")
						res.render("regsuccess", {firstNameInput: req.body.firstNameInput, lastNameInput: req.body.lastNameInput})
					}
				})
			}
	})
})

app.get("/eestifilm", (req, res)=>{
	res.render("eestifilm");
});

app.get("/eestifilm/inimesed_add", (req, res)=>{
	res.render("filmiinimesed_add", {notice: "ootan sisestust"});
});

app.post("/eestifilm/inimesed_add", (req, res)=>{
	console.log(req.body);
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.dateofbirthInput || req.body.dateofbirthInput >= new Date()){
		res.render("filmiinimesed_add", {notice: "Andmeid on puudu vöi ebakorrektsed"});
	} else {
		let sqlReq = "INSERT INTO person (first_name, last_name, birth_date, death_date) VALUES (?,?,?,?)";
		const deathDate = req.body.dateofdeathInput === "" ? null : req.body.dateofdeathInput;
		conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.dateofbirthInput, deathDate], (err, sqlres)=>{
			if(err){
				res.render("filmiinimesed_add", {notice: "andmete salvestamine ebaönnestus"});
			} else {
				res.render("filmiinimesed_add", {notice: "salvestamine önnestus"});
			}
		});
	}
});

app.get("/eestifilm/inimesed", (req, res)=>{
	const sqlReq = "SELECT * FROM person";
	conn.execute(sqlReq, (err, sqlres)=>{
		if(err){
			throw(err);
		} else {
			console.log(sqlres);
			res.render("filmiinimesed", {personList: sqlres});
		}
	});
});

app.post("/eestifilm/filmid", (req, res)=>{
	console.log(req.body);
	if(!req.body.titleInput || !req.body.yearInput || !req.body.durationInput){
		res.render("filmid", {notice: "Andmeid on puudu vöi ebakorrektsed"});
	} else {
		let sqlReq = "INSERT INTO movie (title, production_year, duration) VALUES (?,?,?)";
		conn.execute(sqlReq, [req.body.titleInput, req.body.yearInput, req.body.durationInput], (err, sqlres)=>{
			if(err){
				res.render("filmid", {movieList: sqlres, notice: "andmete salvestamine ebaönnestus"});
			} else {
				res.render("filmid", {movieList: sqlres, notice: "salvestamine önnestus"});
			}
		});
	}
});

app.get("/eestifilm/filmid", (req, res)=>{
	const sqlReq = "SELECT * FROM movie";
	conn.execute(sqlReq, (err, sqlres)=>{
		if(err){
			throw(err);
		} else {
			console.log(sqlres);
			res.render("filmid", {movieList: sqlres, notice: ""});
		}
	});
});

app.get("/eestifilm/ametid", (req, res)=>{
	const sqlReq = "SELECT * FROM position";
	conn.execute(sqlReq, (err, sqlres)=>{
		if(err){
			throw(err);
		} else {
			console.log(sqlres);
			res.render("ametid", {positionList: sqlres});
		}
	});
});

app.get("/eestifilm/ametid_add", (req, res)=>{
	res.render("ametid_add", {notice: "ootan sisestust"});
});

app.post("/eestifilm/ametid_add", (req, res)=>{
	console.log(req.body);
	if(!req.body.positionNameInput || !req.body.descriptionInput){
		res.render("ametid_add", {notice: "Andmeid on puudu vöi ebakorrektsed"});
	} else {
		let sqlReq = "INSERT INTO position (name, description) VALUES (?,?)";
		conn.execute(sqlReq, [req.body.positionNameInput, req.body.descriptionInput], (err, sqlres)=>{
			if(err){
				res.render("ametid_add", {notice: "andmete salvestamine ebaönnestus"});
				console.log(err);
			} else {
				res.render("ametid_add", {notice: "salvestamine önnestus"});
			}
		});
	}
});
app.listen(5332);