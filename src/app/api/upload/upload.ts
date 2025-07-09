import 'dotenv/config';
import { Vimeo } from '../../../lib/Vimeo/vimeo';

// Define interface for environment variables
interface EnvConfig {
    VIMEO_CLIENT_ID?: string;
    VIMEO_CLIENT_SECRET?: string;
    VIMEO_ACCESS_TOKEN?: string;
}

// Load environment variables
const envConfig: EnvConfig = {
  VIMEO_CLIENT_ID: process.env.VIMEO_CLIENT_ID,
  VIMEO_CLIENT_SECRET: process.env.VIMEO_CLIENT_SECRET,
  VIMEO_ACCESS_TOKEN: process.env.VIMEO_ACCESS_TOKEN
};

// Validate required environment variables
if(!envConfig.VIMEO_ACCESS_TOKEN) {
  throw new Error('You cannot upload a video without configuring an access token. ' +
        'Please set VIMEO_ACCESS_TOKEN in your .env.local file');
}

if(!envConfig.VIMEO_CLIENT_ID || !envConfig.VIMEO_CLIENT_SECRET) {
  console.error('ERROR: For this example to run properly you must create an API app at ' +
        'https://developer.vimeo.com/apps/new and set your callback url to ' +
        '`http://localhost:3000/redirect`.');
  console.error('ERROR: Add your credentials to .env.local file:');
  console.error('VIMEO_CLIENT_ID=your_client_id');
  console.error('VIMEO_CLIENT_SECRET=your_client_secret');
  console.error('VIMEO_ACCESS_TOKEN=your_access_token');
  process.exit(1);
}

// Instantiate the Vimeo client
const client = new Vimeo(
  envConfig.VIMEO_CLIENT_ID,
  envConfig.VIMEO_CLIENT_SECRET,
  envConfig.VIMEO_ACCESS_TOKEN
);

// File path to upload
const filePath = '<full path to a video on the filesystem>';
console.log('Uploading: ' + filePath);

// Video parameters
const videoParams = {
  name: 'Vimeo API SDK test upload',
  description: "This video was uploaded through the Vimeo API's NodeJS SDK."
};

// Upload the video
client.upload(
  filePath,
  videoParams,
  (uri: string) => {
    // Get the video metadata after upload
    client.request(`${uri}?fields=link`, (error: Error, body: { link: string }, statusCode: number) => {
      if(error) {
        console.error('There was an error making the request:', error);
        return;
      }

      console.log(`"${filePath}" has been uploaded to ${body.link}`);

      // Edit the video metadata
      client.request({
        method: 'PATCH',
        path: uri,
        params: {
          name: 'Vimeo API SDK test edit',
          description: "This video was edited through the Vimeo API's NodeJS SDK."
        }
      }, (error: Error) => {
        if(error) {
          console.error('There was an error editing the video:', error);
          return;
        }

        console.log(`The title and description for ${uri} has been edited.`);

        // Check transcoding status
        client.request(
          `${uri}?fields=transcode.status`,
          (error: Error, body: { transcode: { status: string } }) => {
            if(error) {
              console.error('Error checking transcode status:', error);
              return;
            }
            console.log(`The transcode status for ${uri} is: ${body.transcode.status}`);
          }
        );
      });
    });
  },
  (bytesUploaded: number, bytesTotal: number) => {
    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
    console.log(`Upload progress: ${bytesUploaded}/${bytesTotal} (${percentage}%)`);
  },
  (error: Error) => {
    console.error('Upload failed:', error);
  }
);