const { Router } = require("express");
const router = Router();
const storyController = require("../controllers/story.controller.js")
const verifyJWT = require("../middleware/auth.middleware.js");

// router.get("/", (req, res) => {
//   res.redirect("/user/login");
// });

router.post("/add",verifyJWT, storyController.addStory);
router.post('/update/:id',verifyJWT, storyController.editStory);
router.get('/read/:id',verifyJWT,storyController.readStory);
router.get('/getStory', storyController.getStory)
router.post('/addComment/:id', storyController.addcomment)


module.exports=router;