GitHub Link:

https://github.com/Apollo-Level2-Web-Dev/ph-tour-management-system-backend/tree/part-8



Task-2

https://docs.google.com/document/d/12x2crOShsCoUkWFeFV1VowYg4vPEFyhHuh-TbT3sdzc/edit?usp=sharing
# Ph Tour Management Backend Part-8

Postman Collection 

https://github.com/Apollo-Level2-Web-Dev/ph-tour-management-system-backend/blob/part-8/Backend%20PH%20Tour%20Management%20APIs.postman_collection.json

(Download this JSON file and import in your postman)
#### what we will learn in this module?
- generating storing the otp using redis 
- sending the otp through email 
- using the otp verifying the email 
- generating invoice of payment 
- storing the invoice and sending the invoice using email. 
- aggregation pipeline 
- polishing works of the whole project 

## 33-1 Introduction to Redis, Setting and Configuring Redis
- In Here Redis is used to store the generated otp and sending the otp through email 
- In our project when we create a user by default its `verification` status is false. we have to build a mechanism by which we will be able to verify the email. for this we will use redis 

#### What is redis? 
- basically it is in memory database. 
- its store the data in our local machine like no-sql database. but there is a catch `Redis do not keep the data in ssd or hard drive ratcher it store in ram or memory`. for this reason it is called in memory database. 
- basically ram holds temporary data. when a app opens ram holds the data. This helps to make read write faster by holding data. 
- When the data is used the data is removed from the ram 
- OTP is a temporary password, so we will use redis to store it in ram. 
- Redis will give us a `ec2` server which is based on `AWS`. Itself it is a computer and has some ram and storage functionality. the OTP will be stored in storage/ram. If used or time expired it will be deleted from the ram. 
- Another works of redis is `caching` but this not our main focus right now. 
- Redis can be used as a database, cache, streaming engine, message broker, and more.

[Redis Docs](https://redis.io/docs/latest/develop/clients/nodejs/)

#### Lets Move to the Installation Part Of Redis 

- install redis 

```
npm install redis -f 

```
- setup the redis.config.ts 

```ts
/* eslint-disable no-console */
import { createClient } from 'redis';
import { envVars } from './env';

const redisClient = createClient({
    username: envVars.REDIS_USERNAME,
    password: envVars.REDIS_PASSWORD,
    socket: {
        host: envVars.REDIS_HOST,
        port: Number(envVars.REDIS_PORT)
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

//     await redisClient.connect();
//     await redisClient.set('foo', 'bar');
//     const result = await redisClient.get('foo');
//     console.log(result)  // >>> bar

//  we will connect the redis inside the server 
export const connectRedis = async () => {
    //  we have not used try catch because already redis handled the error by using redisClient.on('error', err => console.log('Redis Client Error', err));
    if (!redisClient.isOpen) { // used this because if once connected there is no need to connect redis again 
        await redisClient.connect();
        console.log("Redis Connected !")
    }

    // await redisClient.set('foo', 'bar');
    // const result = await redisClient.get('foo');
    // console.log(result)  // >>> bar
}
```

- server.ts 

```ts 
/* eslint-disable no-console */
import { Server } from "http"

import mongoose from "mongoose"
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server


const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);
        console.log("Connected To MongoDb")
        server = app.listen(envVars.PORT, () => {
            console.log(`Server is Running On Port ${envVars.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

(async () => {
    await connectRedis() // redis connected 
    await startServer()
    await seedSuperAdmin()
})()

process.on("SIGTERM", (err) => {
    console.log("Signal Termination Happened...! Server Is Shutting Down !", err)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)

})

process.on("SIGINT", () => {
    console.log("I am manually Closing the server! Server Is Shutting Down !")

    // if express server is on and unhandled rejection happens close the express server using server.close()
    // then close the node server using process.exit(1)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)

})
process.on("unhandledRejection", () => {

    console.log("Unhandled Rejection Happened...! Server Is Shutting Down !")

    // if express server is on and unhandled rejection happens close the express server using server.close()
    // then close the node server using process.exit(1)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)

})

process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception Happened...! Server Is Shutting Down !", err)

    // if express server is on and unhandled rejection happens close the express server using server.close()
    // then close the node server using process.exit(1)
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1)

})

//  test unhandled rejection

// Promise.reject(new Error("Opps! Unhandled Rejection Happened !....Forgot To Catch error ! "))


// TESTING uncaughtException
// throw new Error("Maamah I'm Uncaught exception error ")

```

## 33-2 Create a function to generate and send OTP by Email

- otp.route.ts 

```ts 
// src/modules/otp/otp.routes.ts
import express from "express";
import { OTPController } from "./otp.controller";

const router = express.Router();

router.post("/send", OTPController.sendOTP); // otp will be generated and stored in redis and then will be sent to email 
router.post("/verify", OTPController.verifyOTP);
// when a user uses the otp this route will verify the otp taking from the redis and compare .
//  if otp matches we will make isVerified true 

export const OtpRoutes = router;
```

- otp.controller.ts 

```ts 
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OTPService } from "./otp.service";


const sendOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, name } = req.body
    await OTPService.sendOTP(email, name)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP sent successfully",
        data: null,
    });
})

export const OTPController = {
    sendOTP,
    verifyOTP
};
```
- utils -> templates -> otp.ejs

```ejs 
<h2>Hello <%= name %>,</h2>
<p>Your OTP code is: <strong><%= otp %></strong></p>
<p>This code is valid for 2 minutes.</p>
```

- otp.service.ts

```ts 

import crypto from "crypto"
import { User } from "../user/user.model"
import AppError from "../../errorHelpers/AppError"
import { redisClient } from "../../config/redis.config"
import { sendEmail } from "../../utils/sendEmail"

const OTP_EXPIRATION = 2 * 60 // 2 minute 

const generateOtp = (length = 6) => {
    // 6 digit otp 
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()
    // 10 ** 5 => 10 * 10 *10 *10 *10 * 10 => 1000000

    return otp
}


const sendOTP = async (email: string, name: string) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(404, "User not found")
    }

    if (user.isVerified) {
        throw new AppError(401, "You are already verified")
    }

    const otp = generateOtp();

    const redisKey = `otp${email}`



    // storing in redis 

    // await redisClient.set(Key, value,options)
    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX", // this is for telling the time type milisec or sec or any  
            value: OTP_EXPIRATION
        }
    })

    //  now send the otp in email 

    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp
        }
    })


};

export const OTPService = {
    sendOTP,
    verifyOTP
}
```
## 33-3 Using Redis Database to Verify the OTP
- otp.controller.ts 

```ts 
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OTPService } from "./otp.service";


const sendOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, name } = req.body
    await OTPService.sendOTP(email, name)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP sent successfully",
        data: null,
    });
})

const verifyOTP = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body
    await OTPService.verifyOTP(email, otp)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "OTP verified successfully",
        data: null,
    });
})

export const OTPController = {
    sendOTP,
    verifyOTP
};
```

- otp.service.ts 

```ts 

import crypto from "crypto"
import { User } from "../user/user.model"
import AppError from "../../errorHelpers/AppError"
import { redisClient } from "../../config/redis.config"
import { sendEmail } from "../../utils/sendEmail"

const OTP_EXPIRATION = 5 * 60 // 2 minute 

const generateOtp = (length = 6) => {
    // 6 digit otp 
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString()
    // 10 ** 5 => 10 * 10 *10 *10 *10 * 10 => 1000000

    return otp
}


const sendOTP = async (email: string, name: string) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(404, "User not found")
    }

    if (user.isVerified) {
        throw new AppError(401, "You are already verified")
    }

    const otp = generateOtp();

    const redisKey = `otp:${email}`



    // storing in redis 

    // await redisClient.set(Key, value,options)
    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX", // this is for telling the time type milisec or sec or any  
            value: OTP_EXPIRATION
        }
    })

    //  now send the otp in email 

    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp
        }
    })


};

const verifyOTP = async (email: string, otp: string) => {
    // const user = await User.findOne({ email, isVerified: false })
    const user = await User.findOne({ email })

    if (!user) {
        throw new AppError(404, "User not found")
    }

    if (user.isVerified) {
        throw new AppError(401, "You are already verified")
    }

    const redisKey = `otp:${email}`

    console.log(redisKey)


    const savedOtp = await redisClient.get(redisKey)

    console.log(savedOtp)

    if (!savedOtp) {
        throw new AppError(401, "Invalid OTP");
    }

    if (savedOtp !== otp) {
        throw new AppError(401, "Invalid OTP");
    }


    await Promise.all([
        User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redisClient.del([redisKey])
    ])

};


export const OTPService = {
    sendOTP,
    verifyOTP
}
```

## 33-4 Create a function to generate pdf of the invoice of booking and payment of a tour
- so far we are sending a success message to frontend after successful payment. now we will send email and make a pdf and send the pdf link in the email 
- we will use a package named `pdf kit` for generating pdf 

[pdfkit](https://www.npmjs.com/package/pdfkit)

```
npm i pdfkit -f
```

```
npm i @types/pdfkit -f
```

- we will generate a pdf and store it somewhere and give in email the download link and the link will be stored in database as well inside `invoiceUrl`.
- we will use pdfkit foe generating pdf 
- A JavaScript PDF generation library for Node and the browser.
- PDFKit is a PDF document generation library for Node and the browser that makes creating complex, multi-page, printable documents easy. The API embraces chainability, and includes both low level functions as well as abstractions for higher level functionality. The PDFKit API is designed to be simple, so generating complex documents is often as simple as a few function calls.

#### Lets generate a function for the generating pdf 
- We will use stream buffer to create a pdf 
- When generating a PDF, PDFKit does not create the entire file in one go.
- Instead:
    1. It streams chunks of binary data (pieces of the PDF file) as they are generated.
    2. Each chunk is a Uint8Array (raw byte data).
- cannot use those chunks individually.
- need to collect all chunks → combine them → get one complete PDF file.
- Thats We create an array to temporarily store all chunks.

```ts 
const buffer: Uint8Array[] = [];
```
#### How Does This Method Work?

##### Step 1: Listen for "data"

```ts 
doc.on("data", (chunk) => buffer.push(chunk));
```
- Each time PDFKit generates part of the PDF, it emits a "data" event.
- That chunk is a piece of binary data.
- We push it into our buffer array.

##### doc.on("end", () => resolve(Buffer.concat(buffer)));
```ts
doc.on("end", () => resolve(Buffer.concat(buffer)));

```
- "end" means PDF generation is finished.

- At that moment:

    1. buffer contains multiple small Uint8Array chunks.
    2. Buffer.concat(buffer) merges them into one large Buffer.
    3. That Buffer now represents the entire PDF file.

##### 3. Why Use Buffer.concat Instead of a String?

- PDF files are binary data (not plain text).
- Using strings would corrupt the data.
- Buffer in Node.js is a special class for handling binary data correctly.
- Buffer.concat:

    1. Allocates enough memory to hold all chunks,
    2. Copies each chunk in order,
    3. Returns a single continuous block representing the PDF file.

- so the flow is we are grabbing the info inside function and pdfkit is generating the pdf gradually and making buffer?

- utils -> invoice.ts 

```ts 
/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
    transactionId: string;
    bookingDate: Date;
    userName: string;
    tourTitle: string;
    guestCount: number;
    totalAmount: number;
}

export const generatePdf = async (invoiceData: IInvoiceData)=> {
    try {
        // being async function we have explicitly used Promise here because we are using stream system to load the data. 


        // async/await works only with functions that already return a promise.
        // doc.on("end", ...) is callback-style, so you must manually wrap it in a Promise to make it await-compatible.
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: "A4", margin: 50 }) 
            // Creates a new PDFDocument instance (PDFKit). Not explaining PDFKit specifics.
            const buffer: Uint8Array[] = []; 
            //Creates an array named buffer to temporarily store chunks of binary data emitted by the PDF generator.
            // here we are taking an array of buffer which is a type of  UNit8Array[] made for buffer 
            // in this array we will store the buffered data in chunk by chunk


            doc.on("data", (chunk) => buffer.push(chunk)) 
            // wEvery time the document emits a "data" event (a chunk of PDF bytes), push it into buffer.
            doc.on("end", () => resolve(Buffer.concat(buffer)))
            //when all chunks are loaded we will concat the chunks and add it taking from the buffer.
            //here big B buffer is coming from javascript its grabbing the buffer array
            // Concatenate all chunks from buffer into a single Buffer,
            doc.on("error", (err) => reject(err))

            //PDF Content
            doc.fontSize(20).text("Invoice", { align: "center" });
            doc.moveDown()
            doc.fontSize(14).text(`Transaction ID : ${invoiceData.transactionId}`)
            doc.text(`Booking Date : ${invoiceData.bookingDate}`)
            doc.text(`Customer : ${invoiceData.userName}`)

            doc.moveDown();
            doc.text(`Tour: ${invoiceData.tourTitle}`);
            doc.text(`Guests: ${invoiceData.guestCount}`);
            doc.text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`);
            doc.moveDown();

            doc.text("Thank you for booking with us!", { align: "center" });
            doc.end()

        })

    } catch (error: any) {
        console.log(error);
        throw new AppError(401, `Pdf creation error ${error.message}`)
    }
}
```

- here only the buffer is created through the function 
- now from the buffer we have to create a pdf and upload in cloudinary and send the uploaded link to email and as well we have to store te link in database `invoiceUrl`