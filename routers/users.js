let express = require('express');
let router = express.Router();
let UserSchema = require('../models/users');
const bcrypt = require("bcrypt");

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error": message});
}
var sess;

//Gets all the users ---
router.get('/', (request, response, next)=>{
    let name = request.query['name'];
    if (name){
        UserSchema
            .find({"name": name})
            .exec( (error, users) =>{
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(users);
                }
            });
    }else{
        UserSchema
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

//Gets the user with the given email (catch error of id not found)
router.get('/:id', (request, response, next) =>{
    UserSchema
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
    console.log("Hello!");
    console.log(req);
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new UserSchema({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        user.save( (error) => {
            if (error){
                response.send({"error": error});
            }else{
                response.send(user.name);

            }
        });
    });

});

//login page: storing and comparing email and password
router.post('/signin', function (req, response) {
    sess = req.session;
    sess.logingin = "true";
    console.log(req.body.email)
    UserSchema
    .find({"email": req.body.email})
    .exec( (error, userData) =>{
        if (error){
            response.send({"error": error});
        }else{
            if (!userData) {
                           response.send('Email not found!');
                        } else {
                            user = userData[0];
                            
                            console.log(user);
                            
                bcrypt.compare(req.body.password, user.password, function (err, result) {
                       if (result == true) {
                        sess.user._id = user._id;
                        if (sess.user._id == "6281d69c6009f90004b69931"){
                            setTimeout(function(){
                                let parameter = new URLSearchParams();
                                location.href = "adminIndex.html";
                            },3000);
                        }
                        console.log(user._id);
                        
                           response.send('Login Successful!');
                       } else {
                        response.send('Incorrect password');
                       }
                     });
                   // });
                   }
            console.log(user);
            
        }
    });
       
//         if (!user) {
//            response.send('Email not found!');
//         } else {
// bcrypt.compare(sess.password, user.password, function (err, result) {
//        if (result == true) {
//         sess.email = req.body.email;
//         sess.password = req.body.password;
//            response.send('Login Successful!');
//        } else {
//         response.send('Incorrect password');
//        }
//      });
 //   }
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

//logout
router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

module.exports = router;