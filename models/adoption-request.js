const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/module-2', {useMongoClient: true})

const adoptionSchema = new Schema({

    petid: String,
    userid: String,
    message: Number,
    approved: Boolean,
    adoptiondate: Number,
    delivarymethod: String,
    address: String

}) 


const Adoption = mongoose.model(`Adoption`, adoptionSchema);

module.exports = Pet;