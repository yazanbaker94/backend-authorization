'use strict';

const mongoose=require('mongoose');

// defining book properties and thier datatypes :
const bookSchema = new mongoose.Schema({
    name: {type:String},
    description: {type:String},
    status : {type:String}
  });
// incldes the book schema 
// user is an object that contains an array of book objects
const userSchema= new mongoose.Schema({
    email:{type:String},
    books:[bookSchema]
})

//model of the schema
const userModel=mongoose.model('user',userSchema)



module.exports=userModel