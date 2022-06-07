let express = require('express');
let router = express.Router();
const { User, validate } = require('../models/users');
const bcrypt = require('bcrypt');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error": message});
}

//Gets all the users ---
router.get('/', (request, response, next)=>{
    let name = request.query['name'];
    if (name){
        User
            .find({"name": name})
            .exec( (error, users) =>{
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(users);
                }
            });
    }else{
        User
            .find()
            .exec( (error, users) =>{
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(users);
                }
            });
    }
});

//Gets the user with the given id (catch error of id not found)
router.get('/:id', (request, response, next) =>{
    User
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

//Register a User
router.post('/', (req, response, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        user.save( (error) => {
            if(error){
                response.send({'text': 'None', 'error': 'Error'});
            } else {
                response.send({'text': user.name, 'error': 'None'});
            }
        });
    });

});

//login page: storing and comparing email and password
router.post('/signin', function (req, response) {

    User
    .find({"email": req.body.email})
    .exec( (error, userData) =>{
        if (error) {

            // response.send({"error": error}); // Want to give message frontend can use.
            response.send({'text': 'Error signing in. Try again later.', 'id': 'Error', 'error': 'Error'});

            // If the results are not blank, it is a user.
        } else if (userData.length > 0) {

              user = userData[0];

              bcrypt.compare(req.body.password, user.password, function (err, result) {
                   if (result == true) {

                        if (user._id == "6281d69c6009f90004b69931") {
                           response.send({'text': 'Admin Login Successful!', 'id': user._id});
                        } else {
                           response.send({'text': 'Login Successful!', 'id': user._id});
                        }

                   } else {
                    response.send({'text':'Unable to login with this email address and password. ' +
                        'Check your login information and try again.', 'id': 'error'});
                   }
             });
        } else {
          response.send({'text':'Unable to login with this email address and password. ' +
              'Check your login information and try again later.', 'id': 'error'});
        }
    });
 });


//Modifies a user with the given id
router.patch('/:id', (request, response, next) => {
    User
        .findById(request.params.id, (error, result) => {
            // If error while finding user:
            if (error) {
                response.status(500).send(error);
            // If user found:
            }else if (result){
                // Remove ID from request.
                if (request.body._id){
                    delete request.body._id;
                }
                // If the password is new:
                if(result["password"] != request.body["password"]) {

                    bcrypt.hash(request.body["password"], 10).then((hash) => {
                        for(let field in request.body) {
                          result[field] = request.body[field];
                        }
                        result["password"] = hash;
                      result.save((error, user)=>{
                          if (error){
                              response.status(500).send(error);
                          }
                          response.send(user);
                      });
                  });
                // Otherwise, not new password:
                } else {
                  for(let field in request.body) {
                    result[field] = request.body[field];
                  }
                  result.save((error, user)=>{
                      if (error){
                          response.status(500).send(error);
                      }
                      response.send(user);
                  });
                }
            // If no user found:
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }
        });
});


//Need to change this to take the user's id and add to a particular field
router.patch('/purchase/:id', (request, response, next) => {
    User
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
    User
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

//logout
router.post('/logout/',(req,response) => {
  response.send("Logged out successfully.");
});



module.exports = router;
