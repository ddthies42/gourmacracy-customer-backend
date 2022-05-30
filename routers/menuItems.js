let express = require('express');
let router = express.Router();
let MenuSchema = require('../models/menu');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error": message});
}

//Gets all the menu items ---
router.get('/', (request, response, next)=>{
    let item = request.query['item'];
    if (item){
        MenuSchema
            .find({"itemName": item})
            .exec( (error, menuItems) =>{
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(menuItems);
                }
            });
    }else{
        MenuSchema
            .find()
            .exec( (error, menuItems) =>{
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(menuItems);
                }
            });
    }
});

//Gets the menu item with the given id (catch error of id not found)
router.get('/:id', (request, response, next) =>{
    MenuSchema
        .findById({"_id": request.params.id}, (error, result) => {
            if (error){
                response.status(500).send(error);
            }else if (result){
                response.send(result);
            }else{
                response.status(404).send({"id": request.params.id, "error": "Not Found"});
            }
        });
});

// Gets the menu item and returns the _id
router.get('/itemId/:id', (request, response, next) =>{
    MenuSchema
        .findById({"_id": request.params.id}, (error, result) => {
            if (error){
                response.status(500).send(error);
            }else if (result){
                response.send(request.params.id);
            }else{
                response.status(404).send({"id": request.params.id, "error": "Not Found"});
            }
        });
});






//Add a menu item
router.post('/', (request, response, next) =>{
    let menuJSON = request.body;
    if (!menuJSON.itemName || !menuJSON.price)
        HandleError(response, 'Missing Information', 'Form Data Missing', 500);
    else{
        let menuItem = new MenuSchema({
            itemName: menuJSON.itemName,
            category: menuJSON.category,
            description: menuJSON.description,
            price: menuJSON.price,
            points: menuJSON.points,
            numRatings : menuJSON.numRatings 
        });
        menuItem.save( (error) => {
            if (error){
                response.send({"error": error});
            }else{
                response.send(menuItem.itemName);
            }
        });
    }
});

//Modifies a menu item with the given id
router.patch('/:id', (request, response, next) => {
    MenuSchema
        .findById(request.params.id, (error, result) => {
            if (error) {
                response.status(500).send(error);
            }else if (result){
                if (request.body._id){
                    delete request.body._id;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                result.save((error, menuItem)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(menuItem);
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }
        });
});

//for adding ratings and comments to menu items.
router.patch('/rating/:id', (request, response, next) => {
    MenuSchema
        .findById(request.params.id, (error, result) => {
            if (error) {
                response.status(500).send(error);
            }else if (result){
                if (request.body._id){
                    delete request.body._id;
                }
               for (let field in request.body){
                    result[field] = (parseInt(result[field]) + parseInt(request.body[field]));
                }
                result.save((error, menuItem)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(menuItem);
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }
        });
});

router.patch('/comment/:id', (request, response, next) => {
    MenuSchema
        .findById(request.params.id, (error, result) => {
            if (error) {
                response.status(500).send(error);
            }else if (result){
               for (let field in request.body){
                   if (result[field] == ""){
                       result[field] = result[field] + request.body[field];
                   }else{
                       result[field] = result[field] + ", " + request.body[field];
                   }
                }
                result.save((error, menuItem)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(menuItem);
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }
        });
});



//Deletes a menu item with the given id
router.delete('/:id', (request, response, next) => {
    MenuSchema
        .findById(request.params.id, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deletedId": request.params.id});
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }
        });
});













module.exports = router;