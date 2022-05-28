let express = require('express');
let router = express.Router();
const { User, validate } = require('../models/users');
const bcrypt = require('bcrypt');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error": message});
}
var sess;

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

//Gets the user with the given email (catch error of id not found)
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

router.get('/:email', (request, response, next) =>{
    User
        .findById({"email": request.params.email}, (error, result) => {
            if (error){
                response.status(500).send(error);
            }else if (result){
                response.send(request.params.id);
            }else{
                response.status(404).send({"email": request.params.email, "error": "Not Found"});
            }
        });
});


// router.get('/itemId/:id', (request, response, next) =>{
//     MenuSchema
//         .findById({"_id": request.params.id}, (error, result) => {
//             if (error){
//                 response.status(500).send(error);
//             }else if (result){
//                 response.send(request.params.id);
//             }else{
//                 response.status(404).send({"id": request.params.id, "error": "Not Found"});
//             }
//         });
// });


//Register a User
router.post('/', (req, response, next) => {
    console.log("Hello!");
    console.log(req);
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
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
    User
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
                            sess._id = user._id;
                            sessionStorage.setItem("sess._id", sess._id);

                            console.log(user._id);
                            if (sess._id == "6281d69c6009f90004b69931") {
                               response.send('Admin Login Successful!');
                            } else {
                               response.send('Login Successful!');
                            }

                       } else {
                        response.send('Unable to login with this email address and password. ' +
                            'Check your login information and try again.');
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
    User
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
router.get('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/');
    });

});

// This method should be a patch
// Add order number + ,

// method to append a user's orders array in database
router.patch('/purchase/:id', (request, response) => {
    const { id } = request.params
    const changes = request.body
    User
    .findOneAndUpdate(request.params.id, (error, result) => {
        if (error) {
            response.status(500).send(error);
        }else if (result){
            if (changes._id){
                for (let field in changes){
                    result[field] += changes[field] + " ";
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



module.exports = router;


// Friend.findOneAndUpdate(
//     { _id: req.body.id }, 
//     { $push: { friends: objFriends  } },
//    function (error, success) {
//          if (error) {
//              console.log(error);
//          } else {
//              console.log(success);
//          }
//      });
//  )