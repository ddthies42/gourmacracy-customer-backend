const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MenuSchema = new Schema({

    itemName: {
        type: String,

        unique: true
    },

    category: String,

    description: String,

    price: String,

    points: Number,

    numRatings: Number

});



module.exports = mongoose.model('menuItem', MenuSchema);