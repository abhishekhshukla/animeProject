var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    rating: Number,
	animeId:Number,
    author: {
    	id: {
    		type: mongoose.Schema.Types.ObjectId,
    		ref: "User"
    	},
    	username: String
    },
	username:String
});

module.exports = mongoose.model("Comment", commentSchema);