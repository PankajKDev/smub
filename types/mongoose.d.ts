import mongoose from "mongoose";

export type MongooseConnectionCache = {
  connectionDB: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseConnectionCache | undefined;
}
