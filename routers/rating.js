let express = require('express');
let router2 = express.Router();
let MenuSchema = require('../models/menu');
const jwt = require('jsonwebtoken');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error": message});
}














module.exports = router2;