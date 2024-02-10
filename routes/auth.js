const router = require("express").Router();
const admin = require("../config/firebase.config");
const user = require("../models/user");

// User login:
router.get("/login", async (req, res) => {
	if (!req.headers.authorization) {
		return res.status(500).send({ message: "Invalid Token" });
	}
	const token = req.headers.authorization.split(" ")[1];
	try {
		const decodeValue = await admin.auth().verifyIdToken(token);
		if (!decodeValue) {
			return res.status(500).json({ message: "Un Authorize" });
		}
		// checking user email already exists or not
		const userExists = await user.findOne({ user_id: decodeValue.user_id });
		if (!userExists) {
			newUserData(decodeValue, req, res);
		} else {
			updateUserData(decodeValue, req, res);
		}
	} catch (error) {
		return res.status(500).json({ message: error });
	}
});

const newUserData = async (decodeValue, req, res) => {
	try {
		const newUser = new user({
			name: decodeValue.name,
			email: decodeValue.email,
			imageURL: decodeValue.picture,
			user_id: decodeValue.user_id,
			email_verified: decodeValue.email_verified,
			role: "member",
			auth_time: decodeValue.auth_time,
		});

		const savedUser = await newUser.save();
		res.status(200).send({ user: savedUser });
	} catch (error) {
		console.error("Error saving new user:", error);
		res.status(500).send({ success: false, msg: "Error saving new user" });
	}
};

// Update user's data:
const updateUserData = async (decodeValue, req, res) => {
	const filter = { user_id: decodeValue.user_id };
	const options = {
		upsert: true,
		new: true,
	};

	try {
		const result = await user.findOneAndUpdate(
			filter,
			{ auth_time: decodeValue.auth_time },
			options
		);

		res.status(200).send({ user: result });
	} catch (error) {
		res.status(400).send({ success: false, msg: err });
	}
};

router.put("/updateRole/:userId", async (req, res) => {
	const filter = { _id: req.params.userId };
	const role = req.body.role;

	const options = {
		upsert: true,
		new: true,
	};

	try {
		const result = await user.findOneAndUpdate(filter, { role: role }, options);
		res.status(200).send({ user: result });
	} catch (err) {
		res.status(400).send({ success: false, msg: err });
	}
});

// Get all users:
router.get("/getUsers", async (req, res) => {
	const options = { sort: { createdAt: 1 } };

	const cursor = await user.find({}, null, options);

	if (cursor.length > 0) {
		res.status(200).send({ success: true, data: cursor });
	} else {
		res.status(400).send({ success: false, msg: "No Data Found" });
	}
});

// Get a user's favourite data:
router.put("/favourites/:userId", async (req, res) => {
	const userId = req.params.userId;
	const storyId = req.query;

	console.log("userId", userId);

	try {
		console.log("filter and sotryId: ", userId, storyId);

		const result = await user.updateOne(
			{ _id: userId },
			{ $push: { favourites: storyId } }
		);

		if (result.nModified === 1) {
			res.status(200).send({ success: true, msg: "Story added to favorites" });
		} else {
			res.status(400).send({ success: false, msg: "No changes made" });
		}
	} catch (error) {
		console.log("error: " + error);
		res
			.status(400)
			.send({ success: false, msg: "We cannot find any favorites", error });
	}
});

// Get a user by id:
router.get("/getUser/:userId", async (req, res) => {
	const filter = { _id: req.params.userId };

	const userExists = await user.findOne({ _id: filter });
	if (!userExists) {
		return res.status(400).send({ success: false, msg: "indvalid user ID" });
	}
	if (userExists.favourites) {
		console.log("userExists: ", userExists);
		res.status(200).send({ success: true, data: userExists });
	} else {
		res.status(400).send({ success: false, data: null });
	}
});

// Delete a user by ID:
router.delete("/delete/:userId", async (req, res) => {
	const filter = { _id: req.params.userId };

	const result = await user.deleteOne(filter);

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
