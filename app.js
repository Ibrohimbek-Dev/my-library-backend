const express = require("express");
const app = express();
require("dotenv/config");
const cors = require("cors");
const { default: mongoose } = require("mongoose");

app.use(cors({ origin: true }));
app.use(express.json());

// User authentication routes:
const userRoute = require("./routes/auth");
app.use("/api/users", userRoute);

// Stories Link:
const storiesRoute = require("./routes/stories");
app.use("/api/stories/", storiesRoute);

// Favourites Link:
const favouriteRoute = require("./routes/favourite");
app.use("/api/favourites", favouriteRoute);

mongoose.connect(process.env.DB_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});



mongoose
	.connect(process.env.DB_STRING)
	.then(() => {
		app.listen(process.env.PORT || 4000);

		console.log(process.env ? process.env.PORT : 4000);
	})
	.catch((err) => {
		console.log(err);
	});
