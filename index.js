const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require("fs");
const path = require("path");
const bodyparser = require("body-parser");
const vanasonaFile = "./public/txt/vanasonad.txt";
const visitFile = "./public/txt/visitlog.txt";
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/vp_banner_2025_AA.jpg', (req, res) => {
	res.sendFile(path.join(__dirname, 'images', 'vp_banner_2025_AA.jpg'));
});

app.get('/hobi.jpg', (req, res) => {
	res.sendFile(path.join(__dirname, 'images', 'hobi.jpg'));
});

app.get("/", (req, res)=>{
	res.render("index");
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

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
			if(err){
				throw(err);
			} else {
				fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + " \n", (err)=>{
					if(err){
						throw(err);
					} else {
						console.log("Salvestatud!");
						res.render("regvisit");
					}
				});
			}
	});
});

app.get("/visitlog", (req, res)=>{
	let visitlog = [];
	fs.readFile(visitFile, "utf8", (err, data)=>{
			if(err){
				res.render("visitlog", {heading: "Registreeritud kasutajad", listData: ["Ei leidnud ühtegi registreeritud külastust"]});
			} else {
				visitlog = data.split("\n");
				res.render("visitlog", {heading: "Registreeritud kasutajad", listData: visitlog});
			}
	});
});

app.post("/regsuccess", (req, res)=>{
	console.log(req.body);
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
			if(err){
				throw(err);
			} else {
				fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateET.fullDate() + " kell " + dateET.fullTime() +  " \n", (err)=>{
					if(err){
						throw(err);
					} else {
						console.log("Registreerimine edukas!");
						res.render("regsuccess", {firstNameInput: req.body.firstNameInput, lastNameInput: req.body.lastNameInput});
					}
				});
			}
	});
});

app.listen(5332);