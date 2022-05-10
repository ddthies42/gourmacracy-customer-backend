const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let MenuSchema = new Schema({

    menuItem: String,

    category: String,

    points: Number,

    totalVotes: Number

});



module.exports = mongoose.model('Menu', MenuSchema);