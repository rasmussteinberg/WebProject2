const express = require('express')
const router = express.Router()
const fs = require("fs")
const visitFile = "./public/txt/visitlog.txt"
const dateET = require("../src/dateTimeET")


router.get("/registervisit", (req, res)=>{
	res.render("registervisit")
})

router.post("/registervisit", (req, res)=>{
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

router.get("/", (req, res)=>{
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

router.post("/regsuccess", (req, res)=>{
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

module.exports = router