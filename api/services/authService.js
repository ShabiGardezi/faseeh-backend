const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schema/user.schema");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const { AES, enc, mode, pad } = require("crypto-js");
const nodemailer = require("nodemailer");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey:
    "mlsn.283388fc6621d07d39d46a121ba1f156ae439ef3c425a4778d814c2d971fd126",
});
const transporter = nodemailer.createTransport({
  host: "smtp.mailersend.net",
  port: 587,
  // secure: true, // Use true for SSL on port 465, false for TLS on port 587
  auth: {
    user: "MS_py54H7@trial-o65qngkyx2wlwr12.mlsender.net",
    pass: "gWS7CTnkO54VKGE0", // Replace with your App Password, not your account password
  },
});

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

async function verifyToken(req) {
  const { token } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  const user = await User.findOne({ username: decoded.username }, "-password");
  if (!user) throw new Error("user not found");

  return { user, token };
}

function encrypt(text) {
  const iv = enc.Hex.parse("00000000000000000000000000000000");
  return AES.encrypt(text, process.env.JWT_SECRET, {
    iv: iv,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });
}

async function resetPasswordRequest(req) {
  const { identifier } = req.body;

  let user = null;

  if (isEmail(identifier)) {
    user = await User.findOne({ email: identifier });
  } else {
    user = await User.findOne({ username: identifier });
  }

  if (!user) {
    throw new Error("User not found");
  }

  const encryptedName = encrypt(user.username);

  const { email, username } = user;

  const mailOptions = {
    from: "MS_py54H7@trial-o65qngkyx2wlwr12.mlsender.net",
    to: email,
    subject: "Test Email",
    text: "This is a test email sent using Nodemailer",
  };
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log("Error in email sending:", error);
  //   }
  //   console.log("Email sent:", info);
  // });
  const sentFrom = new Sender(
    "MS_Wjyo9X@trial-zr6ke4nnzwe4on12.mlsender.net",
    "faseeh.online"
  );
  const reset_link =
    process.env.DEVELOPMENT_MODE === "production"
      ? `https://faseeh-frontend-zeta.vercel.app/reset-password/new-password?token=${encryptedName}`
      : `http://localhost:3000/reset-password/new-password?token=${encryptedName}`;

  const recipients = [new Recipient(email, username)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Password Reset")
    //     .setHtml(
    //       `<!DOCTYPE html>
    // <html lang="en">
    // <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>Password Reset</title>
    //     <style>
    //         body {
    //             font-family: Arial, sans-serif;
    //             background-color: #f4f4f4;
    //             margin: 0;
    //             padding: 0;
    //         }
    //         .container {
    //             max-width: 600px;
    //             margin: auto;
    //             background: #ffffff;
    //             border-radius: 8px;
    //             box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    //             overflow: hidden;
    //         }
    //         .header {
    //             background: #007bff;
    //             color: white;
    //             padding: 20px;
    //             text-align: center;
    //         }
    //         .header h1 {
    //             margin: 0;
    //         }
    //         .content {
    //             padding: 20px;
    //         }
    //         .content p {
    //             font-size: 16px;
    //             line-height: 1.5;
    //         }
    //         .reset-link {
    //             display: inline-block;
    //             padding: 10px 20px;
    //             margin: 20px 0;
    //             color: white;
    //             background: #007bff;
    //             text-decoration: none;
    //             border-radius: 5px;
    //         }
    //         .footer {
    //             text-align: center;
    //             padding: 10px;
    //             font-size: 12px;
    //             color: #777777;
    //         }
    //     </style>
    // </head>
    // <body>

    // <div class="container">
    //     <div class="header">
    //         <h1>Password Reset Request</h1>
    //     </div>
    //     <div class="content">
    //         <p>Hello,</p>
    //         <p>We received a request to reset your password. Click the link below to create a new password:</p>
    //         <a href=${reset_link} class="reset-link">Reset Password</a>
    //         <p>If you did not request this, please ignore this email.</p>
    //         <p>Thank you!</p>
    //     </div>
    //     <div class="footer">
    //         <p>&copy; {{year}} Your Company Name. All rights reserved.</p>
    //     </div>
    // </div>

    // </body>
    // </html>
    // `
    //     )
    .setText(`This is the link to reset your password : ${reset_link}`);

  const h = await mailerSend.email.send(emailParams);

  return { message: "Reset link successfully sent to email" };
}

function decrypt(encrypted) {
  const iv = enc.Hex.parse("00000000000000000000000000000000");
  return AES.decrypt(encrypted, process.env.JWT_SECRET, {
    iv: iv,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });
}
async function resetPassword(req) {
  const { token, newPassword } = req.body;
  const username = decrypt(token).toString(enc.Utf8);

  let user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }
  const password = await bcrypt.hash(newPassword, 10);
  await User.findOneAndUpdate(
    { _id: user._id },
    {
      $set: {
        password: password,
      },
    }
  );

  return { message: "Password reset successfully" };
}

module.exports = {
  signUp,
  login,
  googleLogin,
  verifyToken,
  resetPasswordRequest,
  resetPassword,
};
