const express = require('express');
const mongoose = require('mongoose');
const userAuth = require('./Auth/auth');
const post = require('./post/posts');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(()=> {
    console.log('db connected');
}).catch((err)=> {
    console.log('not db connected');
});


app.use('/auth', userAuth);
app.use('/api', post);

app.listen(5000, console.log('Running...'));