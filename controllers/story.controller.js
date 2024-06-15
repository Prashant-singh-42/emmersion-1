const Story = require('../models/story.model')
const User = require('../models/user.model')
const jwt = require("jsonwebtoken");

const addStory = async (req, res) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json("token not found");
          }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const story = await Story.create({...req.body, author: decoded?._id})
        await User.updateOne(
            { _id: decoded?._id },
            { $push: { stories: {story:story._id} } }
        );

        res.json({message: "story added successfully", story: story._id})
    } catch (error) {
        console.log(error)
        res.send("story not added")
    }
}

const editStory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title,body } = req.body;
        const story = await Story.findByIdAndUpdate(
          id,
          { body },
          { new: true }
        );
        if (!story) {
          return res.status(404).json({ error: "story not found" });
        }
        res.status(200).json({message: "story updated successfully"});
      } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
      }
}

const readStory = async (req, res) => {
    try {
        const { id } = req.params;
        const story = await Story.findById(id)
        if (!story) {
          return res.status(404).json({ error: "story not found" });
        }
        res.status(200).json({story: story});
      } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
      }
}

const collabRequest = async (req, res) => {
    try {
        const story = await Story.findById(req.body.story)

        await User.updateOne(
            { _id: story.author },
            { $push: { collaboration: req.body } }
          );
        
        res.json({message: "collab req sent"})
    } catch (error) {
        console.log(error);
        res.json({message: "collab not req sent"})
    }
}

const approveCollab = async (req, res) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json("token not found");
          }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const result = await User.findByIdAndUpdate(
            decoded._id,
            { $pull: { collaboration: { story: req.body.story }}},
            { new: true, runValidators: true }
          );
        await User.updateOne(
        { _id: req.body.user },
        { $push: { stories: {story:req.body.story} } }
        );

        res.json({message: "collab approved"})

    } catch (error) {
        console.log(error);
        res.json({message: "collab not req sent"})
    }
}

const declineCollab = async (req, res) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json("token not found");
          }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const result = await User.findByIdAndUpdate(
            decoded._id,
            { $pull: { collaboration: { story: req.body.story }}},
            { new: true, runValidators: true }
          );
        // await User.updateOne(
        // { _id: req.body.user },
        // { $push: { stories: {story:req.body.story} } }
        // );

        res.json({message: "collab rejected"})

    } catch (error) {
        console.log(error);
        res.json({message: "collab not req sent"})
    }
}

const addcomment = async (req, res) => {
    try {
        const { id } = req.params;
        await Story.updateOne(
            { _id: id },
            { $push: { comments: {comment,rating} } }
        );
    } catch (error) {
        
    }
}

const getStory = async (req, res) => {
    try {
        const stories = await Story.find({})
        res.status(200).json(stories);
    } catch (error) {
        console.log(error);
        res.status(501).json(error);
    }
}

module.exports = { getStory, addStory, editStory, readStory, collabRequest, approveCollab, declineCollab, addcomment };