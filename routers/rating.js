let express = require('express');
let router = express.Router();
let MenuSchema = require('../models/menu');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error": message});
}














module.exports = router;