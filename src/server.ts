import mongoose from "mongoose";
import app from "./app";
import {Server} from "http";

let server:Server;

const startServer = async () =>{
 try {
       await mongoose.connect("mongodb+srv://todoapp:todoapp@cluster0.gamza.mongodb.net/tour-management-backend?retryWrites=true&w=majority&appName=Cluster0")
    console.log("Connect to DB!!");
    server = app.listen(5000,()=>{
        console.log("server is listening to port 5000")
    })
 } catch (error) {
    console.log(error)
 }
}
startServer()

