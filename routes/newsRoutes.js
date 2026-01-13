const express = require("express");
const multer = require("multer");
const router = express.Router();

const uploader = multer({dest: "./public/newsphotos/"});
const {
	newsHome,
	addNewsPage,
	addNewsPagePost,
	newsListPage
} = require("../controllers/newsControllers");

router.route("/").get(newsHome);
router.route("/addnews").get(addNewsPage);
router.route("/addnews").post(uploader.single("photoInput"), addNewsPagePost);
router.route("/read").get(newsListPage);

module.exports = router;
