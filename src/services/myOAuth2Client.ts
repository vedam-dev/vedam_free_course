import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;
const id = process.env.GOOGLE_CLIENT_ID;
const secret = process.env.GOOGLE_CLIENT_SECRET;

const myOAuth2Client = new OAuth2(id, secret);
console.log(myOAuth2Client);
export default myOAuth2Client;
