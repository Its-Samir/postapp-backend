require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userAuth = require('./Auth/auth');
const post = require('./post/posts');
const cors = require('cors');

const app = express();

const whiteList = ['https://yourpost.netlify.app'];

const corsOriginFunction = (origin, cb) => {
    if (whiteList.indexOf(origin) !== -1) {
        return cb(null, true);
    }
    throw new Error('Not allowed by CORS');
}

app.use(cors({origin: corsOriginFunction}));
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/testingDB').then(()=> {
    console.log('db connected');
}).catch((err)=> {
    console.log(err);
    console.log('not db connected');
});


app.use('/auth', userAuth);
app.use('/api', post);

app.listen(5000, console.log('Running...'));