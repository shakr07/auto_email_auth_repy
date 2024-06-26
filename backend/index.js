const { google } = require("googleapis");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://127.0.0.1:3000/auth/google/callback"
);

const scopes = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
];

app.get("/auth/google", async (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
    res.redirect(url);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during authentication");
  }
});

app.get("/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.send("Authentication successful! You can close this window.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during authentication callback");
  }
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
