/* eslint-disable no-console */
import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";
import { envVars } from "./config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";



let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)

        console.log("Connected to DB!!");

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listening to port ${envVars.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

(async ()=>{
  await startServer()
await seedSuperAdmin()
})()

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

