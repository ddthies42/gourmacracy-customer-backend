let express = require('express');
//let router2 = express.Router();
let MenuSchema = require('../models/menu');
const jwt = require('jsonwebtoken');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error": message});
}

//Gets all the menu items ---
router.get('/', (request, response, next)=>{
    let name = request.query['menuItem'];
    if (name){
        MenuSchema
            .find({"menuItem": name})
            .exec( (error, name) =>{
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(menu);
                }
            });
    }else{
        MenuSchema
            .find()
            .exec( (error, menu) =>{
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(menu);
                }
            });
    }
});












module.exports = router;//2;