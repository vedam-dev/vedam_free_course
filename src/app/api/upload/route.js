
'use strict';


import { Vimeo } from '../../../lib/Vimeo/vimeo';
let config = {
  access_token: process.env.VIMEO_ACCESS_TOKEN,
  client_id:process.env.VIMEO_CLIENT_ID,
  client_secret:process.env.VIEMO_CLIENT_SECRET
};



if(!config.access_token) {
  throw new Error('You can not upload a video without configuring an access token.');
}

const client = new Vimeo(config.client_id, config.client_secret, config.access_token);

const filePath = '/Users/hrb/Downloads/Vimeo/11977315_3840_2160_30fps.mp4';

console.log('Uploading: ' + filePath);

const params = {
  name: 'Vimeo API SDK test upload',
  description: "This video was uploaded through the Vimeo API's NodeJS SDK."
};

client.upload(
  filePath,
  params,
  function (uri) {

    client.request(uri + '?fields=link', function (error, body, statusCode, headers) {
      if(error) {
        console.log('There was an error making the request.');
        console.log('Server reported: ' + error);
        return;
      }

      console.log('"' + filePath + '" has been uploaded to ' + body.link);


      client.request({
        method: 'PATCH',
        path: uri,
        params: {
          name: 'Vimeo API SDK test edit',
          description: "This video was edited through the Vimeo API's NodeJS SDK."
        }
      }, function (error, body, statusCode, headers) {
        if(error) {
          console.log('There was an error making the request.');
          console.log('Server reported: ' + error);
          return;
        }

        console.log('The title and description for ' + uri + ' has been edited.');


        client.request(
          uri + '?fields=transcode.status',
          function (error, body, statusCode, headers) {
            if(error) {
              console.log('There was an error making the request.');
              console.log('Server reported: ' + error);
              return;
            }

            console.log('The transcode status for ' + uri + ' is: ' + body.transcode.status);
          }
        );
      });
    });
  },
  function (bytesUploaded, bytesTotal) {
    const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
    console.log(bytesUploaded, bytesTotal, percentage + '%');
  },
  function (error) {
    console.log('Failed because: ' + error);
  }
);