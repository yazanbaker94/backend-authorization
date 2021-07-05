'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const mongoose=require('mongoose');
const app = express();
const UserModel = require('./models/user.model')
app.use(cors());

mongoose.connect('mongodb://localhost:27017/user',
    { useNewUrlParser: true, useUnifiedTopology: true }
);

const PORT = process.env.PORT || 3001;

  // TODO: 
  // STEP 1: get the jwt from the headers
  // STEP 2. use the jsonwebtoken library to verify that it is a valid jwt
  // jsonwebtoken dock - https://www.npmjs.com/package/jsonwebtoken
  // STEP 3: to prove that everything is working correctly, send the opened jwt back to the front-end

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