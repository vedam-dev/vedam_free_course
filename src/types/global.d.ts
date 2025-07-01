// src/types/global.d.ts
import { MongoClient } from 'mongodb';

import { store } from '../lib/store';

declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<MongoClient>;
    }
  }

  // For TypeScript 4.4+ or when using ES modules
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;