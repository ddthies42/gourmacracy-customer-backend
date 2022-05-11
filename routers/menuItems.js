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

//Add a menu item
router.post('/', (request, response, next) =>{
    let menuJSON = request.body;
    if (!menuJSON.itemName || !menuJSON.price)
        HandleError(response, 'Missing Information', 'Form Data Missing', 500);
    else{
        let menuItem = new MenuSchema({
            itemName: menuJSON.itemName,
            description: menuJSON.description,
            price: menuJSON.price,
            points: menuJSON.points,
            numRatings : menuJSON.numRatings 
        });
        menuItem.save( (error) => {
            if (error){
                response.send({"error": error});
            }else{
                response.send({"id": menuItem.id});
            }
        });
    }
});


//login page: storing and comparing email and password
app.post('/signin', function (req, response) {
    db.User.findOne({
         where: {
             email: req.body.email
                }
    }).then(function (user) {
        if (!user) {
           response.send('Email not found!');
        } else {
bcrypt.compare(req.body.password, user.password, function (err, result) {
       if (result == true) {
           response.send('Login Successful!');
       } else {
        response.send('Incorrect password');
       }
     });
    }
 });
});

//Modifies a user with the given id
router.patch('/:id', (request, response, next) => {
    UserSchema
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
                result.save((error, user)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(user);
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }
        });
});

//Deletes a user with the given id
router.delete('/:id', (request, response, next) => {
    UserSchema
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