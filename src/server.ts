import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";
import { promise } from "zod/v4";
import { error } from "console";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://todoapp:todoapp@cluster0.gamza.mongodb.net/tour-management-backend?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connect to DB!!");
    server = app.listen(5000, () => {
      console.log("server is listening to port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();

process.on("SIGTERM", () => {
  console.log("SIGTERM signal detected ... server shutting down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1)
});




// unhandled rejection error
// process.on("unhandledRejection", (err) => {
//   console.log("unhandledRejection detected ... server shutting down",err);
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1)
// });
// Promise.reject(new Error(" I forgot to catch this promise"))




// uncaughtException  rejection error
// process.on("uncaughtException", (err) => {
//   console.log("uncaughtException detected ... server shutting down",err);
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1)
// });

// throw new Error ("I forgot to handle this local error")

