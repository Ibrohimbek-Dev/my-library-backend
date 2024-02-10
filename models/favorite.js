const mongoose = require("mongoose");

const favouriteSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},

		imageURL: {
			type: String,
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		storyURL: {
			type: String,
			required: true,
		},
		storyPdfURL: {
			type: String,
			required: true,
		},
	},

	{
		timeStamps: true,
	}
);

module.exports = mongoose.model("favourites", favouriteSchema);
