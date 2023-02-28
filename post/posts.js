const express = require('express');
const Post = require('../collection/post');
const User = require('../collection/user');

const router = express.Router();

router.use(express.json());

router.get('/allposts', async (req, res) => {
    const posts = await Post.find({});
    
    !posts && res.status(500).json('no posts found');

    res.status(200).json(posts);
});

router.get('/userprofile/allposts', async (req, res) => {
    const username = req.query.username;
    const user = await User.find({username: username});
    if (!user[0]) {
        return res.status(500).json('No user found');
    } else {
        const posts = await Post.find({userId: user[0]._id});

        if (!posts) {
            return res.status(500).json('No found found');
        }

        res.status(200).json(posts);
    }
    
});

router.post('/post', async (req, res) => {
    try {

        const newPost = new Post(req.body);

        await newPost.save();
        res.status(200).send(newPost);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json('post liked');
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json('post unliked');

        }

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.post('/:id/comment', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const newComment = {
            id: Math.random(),
            userId: req.body.userId,
            username: req.body.username,
            content: req.body.comment,
            time: new Date()
        }
        await post.updateOne({ $push: { comments: newComment } });
        res.status(200).json('comment added');

    } catch (error) {
        res.status(500).json(error);
        res.redirect('/')
    }
})

module.exports = router;