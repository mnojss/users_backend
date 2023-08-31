import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Setup express-session middleware
app.use(
  session({
    secret: "8765!958136()29",
    resave: true,
    saveUninitialized: true,
  })
);

mongoose
  .connect("mongodb+srv://manojsingh889912:8ClaXsadAPseAeS8@cluster0.6notwe3.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (password === user.password) {
        // Store user data in the session
        req.session.user = user;

        // Now you can access user.name directly from the user object
        res.send({ message: "Login Successful", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "An error occurred during login" });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.send({ message: "User already registered" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      await user.save();
      res.send({ message: "Successfully Registered, Please login now." });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send({ message: "An error occurred during registration" });
  }
});

app.listen(9002, () => {
  console.log("BE started at port 9002");
});
