let express = require('express');
let router = express.Router();
let MenuSchema = require('../models/menu');
const jwt = require('jsonwebtoken');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error": message});
}