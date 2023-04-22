const express = require("express");
const cookieParser = require("cookie-parser");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.routes");
const { auth } = require("./middlewares/auth");
const { blogRouter } = require("./routes/blog.routes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Evaluation 2");
});

app.use("/user", userRouter);

app.use(auth);

app.use("/blogs", blogRouter);

app.listen(port, async (req, res) => {
  try {
    await connection;
    console.log(`Listening on http://localhost:8080`);
  } catch (error) {
    console.log(error.message);
  }
});
