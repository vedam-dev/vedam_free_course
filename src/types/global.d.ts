// src/types/global.d.ts
import { MongoClient } from 'mongodb';

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }

  // For TypeScript 4.4+ or when using ES modules
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}