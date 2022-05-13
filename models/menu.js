const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MenuSchema = new Schema({

    itemName: {
        type: String,

        unique: true
    },

    catagory: {
        type: String,
        enum: ['Appetizer','Salad','Entree','Dessert'],
    },

    description: String,

    price: String,

    points: Number,

    numRatings: Number

});



module.exports = mongoose.model('menuItem', MenuSchema);