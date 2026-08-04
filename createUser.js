// createUser.js
// Usage: node createUser.js "Jane Doe" jane@school.com Password123! teacher
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const [name, email, password, role] = process.argv.slice(2);

if (!name || !email || !password) {
  console.error("Usage: node createUser.js <name> <email> <password> [role]");
  process.exit(1);
}

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await User.findOne({ email });
  if (existing) {
    console.log("User already exists:", email);
  } else {
    const user = await User.create({
      name,
      email,
      password,
      role: role || "teacher",
    });
    console.log(`User created: ${user.email} / role: ${user.role}`);
  }
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
