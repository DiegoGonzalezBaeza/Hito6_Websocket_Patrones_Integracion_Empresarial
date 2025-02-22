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

import http from "node:http";
import type { Socket } from "socket.io";
import { Server } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";

import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { Message } from "./interfaces/message.interface";
import { User } from "./interfaces/user.interface";
import { User as UserModel } from "./models/user.model";


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// ---------------
// Manejo de errores
const handleError = (socket: Socket, event: string, error: Error) => {
  console.log(`Error in event ${event}: ${error.message}`);
  socket.emit("error", {
    event,
    message: "An error occurred",
  });
};
// ---------------

app.use(express.urlencoded({ extended: true }));

// Middleware para manejar errores - debe estar al inicio de las rutas
app.use(loggerMiddleware);

app.use(
    "/api/v1/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpecification)
  );

// static files
app.use(express.static("public"));

const messages: Message[] = [];

// Login with namespace
interface ConnectedUser extends Omit<User, "password"> {
  joinedAt: Date;
}

const connectedUsers: { [key: string]: ConnectedUser } = {};


// chat with namespace
const chat = io.of("/chat");

// Extender la interfaz de Socket para agregar el usuario
declare module "socket.io" {
  interface Socket {
    user?: string | JwtPayload;
  }
}

// --------------------

// Middleware para autenticar usuarios
chat.use(async (socket, next) => {
  try {
    console.log("🔍 Authentication middleware executed");

    const token = socket.handshake.auth.token;
    console.log("📌 Token received:", token); // 👈 Log importante

    if (!token) {
      console.log("❌ No token received");
      return next(new Error("Authentication error"));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("❌ JWT_SECRET is not defined in environment variables");
      return next(new Error("Server error"));
    }

    // Verify the token
    const decoded = jwt.verify(token, secret) as JwtPayload;
    console.log("✅ Token decoded:", decoded); // 👈 Log importante

    if (!decoded.email) {
      console.log("❌ Invalid token (missing email)");
      return next(new Error("Invalid token"));
    }

    // Find user in the database
    const user = await UserModel.findOne({ where: { email: decoded.email } });

    if (!user) {
      console.log("❌ User not found in the database");
      return next(new Error("User not found"));
    }

    console.log("✅ User authenticated:", user.email);
    socket.user = user; // Se asigna el usuario al socket
    next();
  } catch (error) {
    console.log("❌ WebSocket authentication error:", error);
    next(new Error("Authentication error"));
  }
});

// // Middleware para autenticar usuarios
// chat.use((socket: Socket, next) => {
//   const token = socket.handshake.auth.token;

//   if (!token) {
//     console.log("No token provided");
//     return next(new Error("Authentication error"));
//   }

//   try {
//     const { email } = jwt.verify(token, "secret") as JwtPayload;
//     console.log("Payload: ", email);
//     socket.user = email;
//     next();
//   } catch (error) {
//     console.log(error);
//     next(new Error("Authentication error"));
//   }
// });


chat.on("connection", (socket) => {
  const user = socket.user as User; // Recuperamos el usuario completo

  if (!user) {
    console.log("No user found in socket");
    return;
  }
  
  // Guardamos en `connectedUsers`
  connectedUsers[socket.id] = {
    id: user.id,
    email: user.email, // Ahora `email` viene del objeto `user`
    joinedAt: new Date(),
  };

  console.log(`User ${user.email} connected`);

  // Broadcast a todos los usuarios conectados
  chat.emit("users", Object.values(connectedUsers));

  // Evento para unirse a una sala
  socket.on("joinRoom", (room) => {
    socket.join(room);

    const messageData = {
      id: Date.now(),
      userId: user.id,
      username: user.email,
      content: `User ${user.email} joined the chat`,
      timestamp: new Date(),
      room: room,
    };

    chat.to(room).emit("message", messageData);
  });

  // Enviar mensaje solo a la sala
  socket.on("sendMessage", ({ room, message }) => {
    const messageData = {
      id: Date.now(),
      userId: user.id,
      username: user.email,
      content: message,
      timestamp: new Date(),
      room: room,
    };

    messages.push(messageData);
    chat.to(room).emit("message", messageData);
  });

  // Dejar la sala
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User ${user.email} left room: ${room}`);
  });

  // Desconectar usuario
  socket.on("disconnect", () => {
    delete connectedUsers[socket.id];
    console.log(`User ${user.email} disconnected`);

    // Broadcast a todos los usuarios conectados
    chat.emit("users", Object.values(connectedUsers));
  });
});

// --------------------

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
      server.listen(port, () => {
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
