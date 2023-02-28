const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../collection/user');

const router = express.Router();

router.use(express.json());

router.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const existUsername = await User.findOne({ username: username });
        if (existUsername) {
            res.status(403).json('This username is not available.');
        } else {
            const newUser = new User({
                username: username,
                password: hashedPassword
            });
            await newUser.save();
            res.status(200).json(newUser);
        }


    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await User.findOne({ username: username });
        !user && res.status(404).json('No user found with this given username.');
        
        const verifyPassword = await bcrypt.compare(password, user.password);
        !verifyPassword && res.status(401).json('Wrong password entered.');
        
        if (!res.headersSent) {
            const {password, updatedAt, createdAt, ...other} = user._doc;
            //here the password, updatedAt and createdAt will not be sent by express
            res.status(200).send(other);
        }
        
        // if (!user) {
        //     throw new Error('user not found');
        // } else {
        //     if (!verifyPassword) {
        //         res.status(401).json('not valid pw');
        //     } else {
        //         // we need to send this user otherwise we cannot get the user to make it parse with JSON/Axios during the regitration/login process
        //         res.status(200).send(user);
        //     }
        // }

    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({
                'error': 'something went wrong'
            });
        }
    }
});

router.get('/profile', async (req, res)=> {
    try {
        const username = req.query.username;
        const userId = req.query.userId;
        const user = userId ? await User.findById(userId) : await User.findOne({username: username});

        const {password, createdAt, updatedAt, ...other} = user._doc;
        !user && res.status(404).json('No user found');

        res.status(200).json(other);

    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;