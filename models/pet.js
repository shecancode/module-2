const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/module-2', {useMongoClient: true})

const petSchema = new Schema({

    species: String,
    breed: String,
    age: Number,
    gender: String,
    color:  String,
    size: String,
    housetrained: Boolean,
    altered: Boolean,
    vaccinated: Boolean,
    coatlength: String,
    specialneeds: Boolean,
    name: String,
    declawed: Boolean,
    available: Boolean,
    goodwithkids: Boolean,
    goodwithcats: Boolean,
    goodwithdogs: Boolean
    

}) 


const Pet = mongoose.model(`Pet`, petSchema);

module.exports = Pet;