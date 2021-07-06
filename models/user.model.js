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




const dunia =new userModel({
    email: 'duniaalkilany908@gmail.com',
    books: [
        {
            name: 'One Hundred Years of Solitude ',
            description: 'One of the 20th century enduring works, One Hundred Years of Solitude is a widely beloved and acclaimed novel known throughout the world, and the ultimate achievement in a Nobel Prize–winning car..',
            status: 'Published'
        },

        {
            name: 'Hamlet',
            description: 'The Tragedy of Hamlet, Prince of Denmark, or more simply Hamlet, is a tragedy by William Shakespeare, believed to have been written between 1599 and 1601. The play, set in Denmark, recounts how Pri...',
            status: 'published'
        }
    ]
});

dunia.save()
console.log(dunia);


    const yazan=new userModel({
        email: 'yazanbaker94@hotmail.com',
        books: [
            {
                name: 'In Search of Lost Time',
                description: 'also translated as Remembrance of Things Past, novel in seven parts by Marcel Proust, published in Frenc',
                status: 'available'
            },
            {
                name: 'The Divine Comedy ',
                description: 'Belonging in the immortal company of the great works of literature, Dante Alighieris poetic masterpiece, The Divine Comedy, is a moving human drama, an unforgettable visionary journey through the ...',
                status: 'available'
            }
        ]
    });
    yazan.save()
    console.log(yazan);
   




module.exports=userModel