// lib/mongodb.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if(!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if(process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the connection
  if(!global._mongoClientPromise) {
    client = new MongoClient(uri, {
      tls: true,
      tlsAllowInvalidCertificates: false,
    });
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, don't use a global variable
  client = new MongoClient(uri, {
    tls: true,
  });
  clientPromise = client.connect();
}

export default clientPromise;