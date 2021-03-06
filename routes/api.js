const _ = require("lodash");
const express = require('express');
const fs = require('fs');
const Promise = require("bluebird");
const request = require('request-promise');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const https = require('https');
// custom objects
const configservice = require('../services/configservice');
const log4jservice = require('../services/log4jservice');
// custom jwt configure object
const jwtservice = require('../services/jwtservice');

var multer = require('multer')

const router = express.Router();

// Get the user data array from configuration file
const usersArray = configservice.loginCredentials;

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	cb(null, 'public')
  },
  filename: function (req, file, cb) {
	cb(null, Date.now() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file')

var exec = require('child_process').execFile;
var processExe =function(){
	console.log("fun() start");
	exec('public/myexe.exe', function(err, data) {  
		 console.log(err)
		 console.log(data.toString());                       
	 });  
 }

/**
 * Function to return the card data of the logged-in user
 * Works only when user has a valid session
 */
router.get('/getCards', jwtservice.passport.authenticate('jwt', { session: false }),  function(req, res) {
	log4jservice.info("req.user.id",req.user.id);
	const user = usersArray[_.findIndex(usersArray, {id: req.user.id})];
	res.status(200).json({message: "success", cards: user.cards});
});


router.post('/upload', jwtservice.passport.authenticate('jwt', { session: false }), function(req, res) {
	log4jservice.info("req.user.id",req.user.id);
	const user = usersArray[_.findIndex(usersArray, {id: req.user.id})];
	// res.status(200).json({message: Object.keys(req).length, cards: user.cards});

	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			res.status(500).json(err)
		} else if (err) {
			res.status(500).json(err)
		}
		// res.status(200).send(req.file);
		res.status(200).json({message: "success", file: req.file});

 	})
});

router.get('/execute_exe', jwtservice.passport.authenticate('jwt', { session: false }),  function(req, res) {
	log4jservice.info("req.user.id",req.user.id);
	processExe();
	res.status(200).json({message: "success"});
});
module.exports = router;
