const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MenuSchema = new Schema({

    itemName: {
        type: String,

        required: true,

        unique: true
    },

    category: {
        type: String,
       // enum: ['Appetizer','Salad','Entree','Dessert', 'Optional'],
       
       required: true,
    },

    description: String,

    price: {
        type: Number,

        required: true,

    },

    points: Number,

    numRatings: Number,

    comments: [{
        type: String
        

    }],

});



module.exports = mongoose.model('menuItem', MenuSchema);
