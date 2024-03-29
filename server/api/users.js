const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const gravatar = require('gravatar');
const brcypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const keys    = require('../../config');
const passport = require('passport');
// Public routes

router.get('/test', (req,res) => res.json({msg : 'users works'}));

router.post('/register' ,(req,res) => {
    User.findOne({email : req.body.email})
        .then((user) => {
            if(user){
                return res.status(400).json({email : "email already exists"});
            } else {
                const avatar = gravatar.url(req.body.email , {
                    s : '200', // size
                    r : 'pg',  // Rating
                    d : 'mn'   // default
                })
                const newUser = new User({
                    name : req.body.name,
                    email : req.body.email,
                    avatar,
                    password : req.body.password

                })
                brcypt.genSalt(10 , (err , salt) => {
                    brcypt.hash(newUser.password , salt , (err,hash) => {
                      if(err) throw err;
                      newUser.password = hash;
                      newUser.save()
                             .then(user => res.json(user))
                             .catch(err => console.log(err))

                      
                    })
                })
            }
        })
})

//Login User
// Returns a token
router.post('/login' , (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email})
         .then(user => {
             if(!user){
                 return res.status(404).json({email : "user email not found"})
             }
             // check password
             brcypt.compare(password,user.password)
                   .then(isMatch => {
                       if(isMatch){
                         // user matched 
                         // sign token
                          const payload = {id : user.id , name : user.name , avatar : user.avatar}; // create jwt payload
                          jwt.sign(payload,keys.secretOrKey , {expiresIn : 3600} , (err,token) => {
                           return  res.json({
                                success : true,
                                token :   'Bearer ' + token
                            })      
                          })
                       } else {
                           res.status(400).json({password : "password incorrect"})
                       }
                   }) 
         })

})

// Private routes




// api/users/current
// returns current user 
router.get('/current' ,passport.authenticate('jwt' , {session : false})  , (req,res) => {
     res.json({
         id : req.user.id,
         name : req.user.name,
         email : req.user.email
     })
})
module.exports = router;