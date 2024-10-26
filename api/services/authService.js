const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schema/user.schema");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");

const isEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

async function signUp(req) {
  const { username, name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error("User with this email or username already exists.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({ username, name, email, password: hashedPassword });
  await newUser.save();

  return { message: "User registered successfully." };
}

async function login(req) {
  const { identifier, password } = req.body; // Identifier could be email or username

  let user;

  // Determine if identifier is an email or username
  if (isEmail(identifier)) {
    user = await User.findOne({ email: identifier });
  } else {
    user = await User.findOne({ username: identifier });
  }

  // Check if user exists
  if (!user) {
    throw new Error("User not found");
  }

  // Validate password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  // Create JWT token (exclude password in payload)
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
    },
  };
}

async function googleLogin(req) {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const { token } = req.body;

  // Verify the ID token with Google
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub: googleId, email, name } = payload;

  // Check if a user with this Google ID or email already exists
  let user = await User.findOne({ $or: [{ googleId }, { email }] });

  // If user does not exist, create a new user
  if (!user) {
    const password = crypto.randomBytes(8).toString("hex");
    user = new User({
      username: email.split("@")[0],
      name,
      email,
      password,
      googleId,
    });
    await user.save();
  }

  const jwtToken = jwt.sign(
    {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET
  );

  return {
    token: jwtToken,
    user: {
      id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
    },
  };
}

module.exports = {
  signUp,
  login,
  googleLogin,
};
