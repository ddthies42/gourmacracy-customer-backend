const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({

    firstName: String,

    lastName: String,

    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            
        ],
        unique: true
    },

    password: String
});



module.exports = mongoose.model('User', UserSchema);

