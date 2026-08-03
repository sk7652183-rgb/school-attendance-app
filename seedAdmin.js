// Run once to create the first admin account:
//   node seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@school.com";
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Admin already exists:", email);
  } else {
    await User.create({
      name: "Default Admin",
      email,
      password: "ChangeMe123!",
      role: "admin",
    });
    console.log("Admin created:", email, "/ password: ChangeMe123!");
    console.log("Log in and change this password immediately.");
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
