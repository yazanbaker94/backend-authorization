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

app.listen(PORT,()=>{
    console.log(`listening to port: ${PORT}`);
})