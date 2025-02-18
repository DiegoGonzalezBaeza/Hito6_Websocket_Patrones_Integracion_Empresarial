import "dotenv/config";
import express from "express";
import userRoute from "./routes/user.route";
import authRoute from "./routes/auth.route";
import movieRoute from "./routes/movie.route";
import reviewRoute from "./routes/review.route";
// import {pool} from "./config/database"
import { httpErrorHandle } from "./middlewares/httpErrorHandle.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import rateLimit from "express-rate-limit";

import openapiSpecification from "./config/swagger";
import swaggerUi from "swagger-ui-express";
import { sequelize } from "./config/database";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar errores - debe estar al inicio de las rutas
app.use(loggerMiddleware);

app.use(
    "/api/v1/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpecification)
  );


// Configurar el limitador
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 10 peticiones por IP
    message:
        "Too many requests from this IP, please try again later.",
    standardHeaders: true, // Informa el límite en las cabeceras 'RateLimit-*'
    legacyHeaders:false, // Desactiva las cabeceras 'X-RateLimit-*'
});

// Aplicar el limitador globalmente
app.use(limiter);



//  relacionas las rutas de user.route y las especifica al string: "/api/v1/users"
app.use("/api/v1/users", userRoute);

//  relacionas las rutas de auth.route y las especifica al string: "/api/v1/auth"
app.use("/api/v1/auth", authRoute);

//  relacionas las rutas de movie.route y las especifica al string: "/api/v1/movies"
app.use("/api/v1/movies", movieRoute);

//  relacionas las rutas de review.route y las especifica al string: "/api/v1/reviews"
app.use("/api/v1/reviews", reviewRoute);


// Middleware para manejar errores - debe estar al final de las rutas
app.use(httpErrorHandle);

const main = async () => {
    try {
      await sequelize.sync({ force: true });
      console.log("Database connected");
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  main();


// // Para levantar el servidor
// const main = async() => {
//     try {
//         const { rows } = await pool.query("SELECT NOW()");
//         console.log(rows[0].now, "db conectada !");
//         // Para levantar el servidor
//         app.listen(port, () => {
//             console.log("Servidor andando en el puerto: "+ port);
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }; 

// main();
