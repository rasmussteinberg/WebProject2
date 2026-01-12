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

const visitlogRoute = require('./routes/visitlogRoute')
app.use('/visitlog', visitlogRoute)

const eestifilmRoute = require('./routes/eestifilmRoute')
app.use('/eestifilm', eestifilmRoute)

app.listen(5332);