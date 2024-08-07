import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const scopes = ["https://www.googleapis.com/auth/userinfo.profile"];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
});

console.log("Authorize this app by visiting this URL:", authUrl);
