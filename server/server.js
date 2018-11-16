const express = require('express');
const app = express();
const mongoose = require('mongoose');


const users = require('./api/users');
const profiles = require('./api/profiles');
const posts = require('./api/posts');

// Use routes
app.use('/api/users',users);
app.use('/api/profiles',profiles);
app.use('/api/posts',posts)










mongoose.connect('mongodb://asishkr123:password123@ds035907.mlab.com:35907/dev_connect',  { useNewUrlParser: true });
mongoose.connection.once('open' , () => {
  console.log('mongodb connected')
})


app.get('/', (req,res) => {res.send('Hi')}
)


app.listen('5000',()=> {console.log('started')})

