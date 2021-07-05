'use strict';

const mongoose=require('mongoose');

/*
first define a schema 
schema: description about how the data must looklike in the database
cats:
    name:{type:String}
*/

const bookSchema = new mongoose.Schema({
    name: {type:String},
    description: {type:String},
    status : {type:String}
  });

const userSchema= new mongoose.Schema({
    email:{type:String},
    books:[bookSchema]
})


const userModel=mongoose.model('user',userSchema)

    const yazan=new userModel({
        email: 'yazanbaker94@hotmail.com',
        books: [
            {
                name: 'In Search of Lost Time',
                description: 'also translated as Remembrance of Things Past, novel in seven parts by Marcel Proust, published in Frenc',
                status: 'available'
            }
        ]
    });

    console.log(yazan);
    yazan.save()




module.exports=userModel