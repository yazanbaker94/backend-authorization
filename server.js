'use strict';
const express = require('express');
const app = express();

// require mongoose
const mongoose=require('mongoose');



require('dotenv').config();
const PORT = process.env.PORT ;
const cors = require('cors');
app.use(cors()); 

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
app.use(express.json())


// mongoose  connect to the database at localhost:27017
mongoose.connect('mongodb://localhost:27017/user',
    { useNewUrlParser: true, useUnifiedTopology: true }
);


const UserModel = require('./models/user.model')




  

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


app.get('/books', (req,res) =>{
  const email=req.query.email
  
  UserModel.findOne({email:email}, (error, books)=>{
      if (error){
          res.send(error.message)
          
      }
      res.send(books);
      
   
  });
  
})


app.post('/books', (req,res) => {

    const {userEmail,bookName,bookStatus,bookDescription} = req.body;

    UserModel.find({ email:userEmail }, function (err, user) {
        if (err) return console.error(err);
        const newBook ={
            name : bookName,
            description: bookDescription,
            status : bookStatus
        };
       console.log(user)

        user[0].books.push(newBook);
        user[0].save();
        res.send(user[0])
        console.log(user.books)
    });
})

app.delete('/books/:id', async (req, res) => {
    const index = Number(req.params.index);
    const { email } = req.query;
    UserModel.find({ email: email }, (err, userBooks) => {
       res.send(userBooks)
    })
})
  

app.listen(PORT,()=>{
    console.log(`listening to port: ${PORT}`);
})