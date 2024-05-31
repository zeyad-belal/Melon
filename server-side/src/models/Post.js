const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.set("toJSON", { virtuals: true });
mongoose.set("toObject", { virtuals: true });

const postSchema = new Schema({
  description:{
    type : String,
    required : true
  },
  keywords:{
    type : Array
  },
  images: {
    type: Object 
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});



const Post = mongoose.model("Post", postSchema);

module.exports = Post;
