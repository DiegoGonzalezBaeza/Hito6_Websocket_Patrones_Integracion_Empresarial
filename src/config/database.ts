import "dotenv/config";
import { Sequelize } from "sequelize-typescript";
import { User } from "../models/user.model";
import { Movie } from "../models/movie.model";
import { Review } from "../models/review.model";

const connectionString = process.env.CONNECT_DB;

if (!connectionString) {
    throw new Error("La variable de entorno CONNECT_DB no está definida.");
  }

export const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  models: [User, Movie, Review],
  logging: false, // disable logging
});

// sequelize.sync({ force: true }).then(() => {
//   console.log("Database & tables created!");
// });

