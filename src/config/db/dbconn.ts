import pgPromise from "pg-promise";
import { config } from "../index";

const pgp = pgPromise();
const connectionString = config.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in the environment variables");
}

export const dbconn = pgp(connectionString);
