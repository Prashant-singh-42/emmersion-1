const mongoose = require('mongoose');

const storySchema =  mongoose.Schema(
  {
    title:{
      type:String,
      required:true,
      trim:true,
      unique:true,
    },
    body:{
      type: String,
    },
    author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    comments:[{
      comment:String,
      rating:Number,
    }]
  }
)

const Story = mongoose.model("Story",storySchema);
module.exports=Story;