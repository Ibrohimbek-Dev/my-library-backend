const router = require("express").Router();
const Favorite = require("../models/favorite");

// Get all data:
router.get("/getAll", async (req, res) => {
	const options = {
		sort: { createdAt: 1 },
	};

	const cursor = await Favorite.find({}, null, options);

	try {
		if (cursor.length > 0) {
			res.status(200).send({ success: true, data: cursor });
		} else {
			res.status(400).send({ success: false, msg: "Sevimliklar topilmadi!" });
		}
	} catch (error) {
		res.status(400).send({ success: false, msg: "Xatolik yuz berdi!" });
	}
});

// Save an item to favourites:
router.post("/save", async (req, res) => {
	const { name, imageURL, storyURL, category, storyPdfURL, author } = req.body;

	// Check if the item already exists in favourites
	const existingFavourite = await Favorite.findOne({ name });

	if (existingFavourite) {
		return res
			.status(400)
			.json({ success: false, msg: "Item already exists in favourites" });
	}

	// Create a new favourite document
	const newFavourite = new Favorite({
		name,
		imageURL,
		storyURL,
		category,
		storyPdfURL,
		author,
	});

	// Save the new favourite to MongoDB
	try {
		const savedFavorite = await newFavourite.save();
		res.status(200).send({ favorite: savedFavorite, success: true, msg: "Ma'lumot qo'shildi" });
	} catch (error) {
		res.status(400).send({ success: false, msg: error });
	}
});

// Delete an item from the favourites:
router.delete("/delete/:deleteId", async (req, res) => {
	const filter = { _id: req.params.deleteId };

	const result = await Favorite.deleteOne(filter);

	try {
		if (result.deletedCount === 1) {
			res.status(200).send({
				success: true,
				msg: "Ma'lumot o'chirib tashlandi!",
				data: result,
			});
		}
	} catch (err) {
		res.status(400).send({
			success: false,
			msg: "Ma'lumot topilmadi yoki allaqachon o'chirib tashlangan!",
		});
	}
});

module.exports = router;
