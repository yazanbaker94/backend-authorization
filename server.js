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
    dunia.save()
console.log(dunia);

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


app.delete('/books/:index',(req,res)=>{
  // console.log(req.params)
  const index = Number(req.params.book_idx);
  // console.log(index)
  const {email}=req.query;
  userModel.findOne({email:email},(error,data)=>{
  // const mydelet=data[0]
  //  console.log('data',data)
  
  if (error) {
    res.send(error)
} else {
   data.books.splice(Index, 1);
   data.save();
    res.send(data.books);
    // res.send('cat deleted')
}

});
});









app.listen(PORT,()=>{
    console.log(`listening to port: ${PORT}`);
})