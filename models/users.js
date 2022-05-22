const Joi = require('joi');
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({

    name: {

    type: String,
    required: true
},

    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            
        ],
        unique: true,
        required: true
    },

    password: {

     type: String,
     required: true
    },

    orders: {
        type: String,
        default: null

    }


});



 

const User = mongoose.model("User", UserSchema);

const validate = (user) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        orders: Joi.string().required()
    });
    return schema.validate(User);
};

module.exports = { User, validate };