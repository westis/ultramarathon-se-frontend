import { OAuth2Client } from "google-auth-library";

export default defineEventHandler(async (event) => {
  const client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  const authCode = process.env.AUTHORIZATION_CODE;

  if (!authCode) {
    throw new Error("Authorization code is missing");
  }

  const response = await client.getToken(authCode);
  const tokens = response.tokens;
  client.setCredentials(tokens);

  return tokens.access_token;
});
