require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("🔥 MongoDB Connected!"))
  .catch((err) => console.log("MongoDB Error:", err));

// Routes
const userRoutes = require("./routes/userRoutes");
const scoreRoutes = require("./routes/scoreRoutes");

app.use("/api/users", userRoutes);
app.use("/api/scores", scoreRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
