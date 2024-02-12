const express = require("express");
const app = express();
require("dotenv/config");
const cors = require("cors");
const { default: mongoose, connect } = require("mongoose");

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

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true });
mongoose.connection
	.once("open", () => console.log("Connected"))
	.on("error", (error) => {
		console.log(`Error : ${error}`);
	});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});