'use strict';
const express = require('express');
const app = express();

// require mongoose
const mongoose=require('mongoose');

app.use(express.json());

require('dotenv').config();
const PORT = process.env.PORT ;
const cors = require('cors');
app.use(cors()); 

const jwt = require('jsonwebtoken'
);
const jwksClient = require('jwks-rsa');
//


// mongoose  connect to the database at localhost:27017
mongoose.connect('mongodb://localhost:27017/user',
    { useNewUrlParser: true, useUnifiedTopology: true }
);


const userModel = require('./models/user.model')




  

  const client = jwksClient({
    // this url comes from your app on the auth0 dashboard 
    jwksUri: `https://dev-rxdxwsv9.eu.auth0.com/.well-known/jwks.json`
  });

// this is a ready to use function
const getKey=(header, callback)=>{
    client.getSigningKey(header.kid, function(err, key) {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
      });
}

// 'Bearer ;alsdkj;laskd;lkasd;lkl'
app.get('/authorize',(req,res)=>{
    const token=req.headers.authorization.split(' ')[1];
    jwt.verify(token,getKey,{},(err,user)=>{
        if(err){
            res.send('invalid token');
        }
        res.send(user)
    })
    res.send(token);
});

function seedingUserShema(){

    const dunia =new userModel ({
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
    const yazan=new userModel({
        email: 'softwaredohanow@gmail.com',
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

    dunia.save();
    console.log(yazan);
    yazan.save();
    console.log(yazan);
   

}
seedingUserShema();









//books end point :get 
app.get('/books', (req,res) =>{
  const email=req.query.email
  
userModel.findOne({email:email}, (error, result)=>{
      if (error){
          res.send(error.message)
      }
      res.send(result);
   
  });
  
});



app.post('/books',(req,res)=>{
  
 const {email,name,description,status }=req.body
userModel.findOne({email:email},(error,data)=>{
    if (error) {
        res.send(error.message)
    } else{

data.books.push({
name:name,
description:description,
status:status
})
data.save();
res.send(data.books)
    // console.log(data)
}
  });
});




app.delete('/books/:index', (req, res)=> {
 
  
   
    const index = Number(req.params.index);
    // console.log(index)
    const { email} = req.query;
    
    userModel.findOne({email: email}, (err, data) => {
        
        const newdelete=data.books.filter((bok,idx)=>
        {
          return idx !==index
        })
       data.books=newdelete;
       data.save();
        res.send('the book deleted')
    });
});


app.listen(PORT,()=>{
    console.log(`listening to port: ${PORT}`);
})