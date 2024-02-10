const router = require("express").Router();
const stories = require("../models/stories");

// Get all stories:
router.get("/getAll", async (req, res) => {
	const options = { sort: { createdAt: 1 } };

	const cursor = await stories.find({}, null, options);

	try {
		if (cursor.length > 0) {
			res.status(200).send({ success: true, data: cursor });
		} else {
			res.status(404).send({ success: false, msg: "Hikoyalar topilmadi 🥲!" });
		}
	} catch (err) {
		res
			.status(404)
			.send({ success: false, msg: `Xatolik yuz berdi 😥! ${err}` });
	}
});

// Post a story:
router.post("/save", async (req, res) => {
	const newStory = stories({
		name: req.body.name,
		imageURL: req.body.imageURL,
		storyURL: req.body.storyURL,
		category: req.body.category,
		storyPdfURL: req.body.storyPdfURL,
		author: req.body.author,
	});

	try {
		const savedStory = await newStory.save(req);
		
		res.status(200).send({ story: savedStory });
	} catch (err) {
		res.status(400).send({ success: false, msg: "error (backend): ", err });
	}
});


// Get a story by ID:
router.get("/getOne/:getOneId", async (req, res) => {
	const filter = { _id: req.params.getOneId };
	const cursor = await stories.findOne(filter);

	if (cursor) {
		res.status(200).send({ success: true, data: cursor });
	} else {
		res.status(200).send({ success: false, msg: "Hikoya topilmadi 🥲!" });
	}
});

// Update a story by ID:
router.put("/update/:updateId", async (req, res) => {
	const filter = { _id: req.params.updateId };

	try {
		// Check is the document exists:
		const existingStory = await stories.findOne(filter);

		if (!existingStory) {
			return res
				.status(404)
				.send({ success: false, msg: "Hikoya topilmadi 🥲!" });
		}

		const options = {
			new: true,
		};

		const result = await stories.findOneAndUpdate(
			filter,
			{
				$set: {
					name: req.body.name,
					imageURL: req.body.imageURL,
					storyURL: req.body.storyURL,
					category: req.body.category,
					storyPdfURL: req.body.storyPdfURL,
					author: req.body.author,
				},
			},
			options
		);

		res.status(200).send({ success: true, story: result });
	} catch (error) {
		res.status(400).send({ success: false, msg: error.message });
	}
});

// Delete a story:
router.delete("/delete/:deleteId", async (req, res) => {
	const filter = { _id: req.params.deleteId };

	try {
		const result = await stories.deleteOne(filter);
		if (result.deletedCount === 1) {
			res.status(200).send({
				success: true,
				msg: "Hikoya muvafaqqiyatli o'chirib tashlandi 😎!",
				data: result,
			});
		} else {
			res.status(404).send({
				success: false,
				msg: "Hikoya topilmadi yoki allaqachon o'chirib tashlangan 😥!",
			});
		}
	} catch (error) {
		console.log("Xikoyani o'chirishda xatolik yuz berdi:", error);
		res.status(500).send({
			success: false,
			msg: "Server error: Unable to delete the story 😥!",
		});
	}
});

module.exports = router;
