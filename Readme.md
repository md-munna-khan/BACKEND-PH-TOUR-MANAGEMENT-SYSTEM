## Requirement Analysis - PH Tour Management System Backend

https://docs.google.com/document/d/1XRN18ClObPMJGKl7CfZFBLeZuJf2h8JOBc_crzuWtT4/edit?tab=t.0

Workflow of the PH Tour Management System

https://gitmind.com/app/docs/mzkbj5o2

PH Tour Management System Data Modelling

https://docs.google.com/document/d/1NSELQ7_jUx4xLGchef4HT3_9YqDWrdzUUGMZWmD2lY0/edit?tab=t.0

ER Diagram for PH Tour Management System

https://drive.google.com/file/d/1ASphx7B6gHIKPiiiNf3AB_ZTvdYRBsQz/view?usp=sharing

PNG Format of ER Diagram for PH Tour Management System

https://drive.google.com/file/d/1KspyCQ992oAw1dDhIzRtK8-q5jnhWG0z/view?usp=drive_link

PH Tour Management System API Endpoints

https://docs.google.com/document/d/1HysoioRCpSsGpSz8JQZRGii9GNkpdx0pEX-zHP2p334/edit?tab=t.0

GitHub Repository

https://github.com/Apollo-Level2-Web-Dev/ph-tour-management-system-backend

Project Setup Branch

https://github.com/Apollo-Level2-Web-Dev/ph-tour-management-system-backend/tree/project-setup

Development Branch

https://github.com/Apollo-Level2-Web-Dev/ph-tour-management-system-backend/tree/development# Industry-Maestro-Ph-Tour-project-setupManagement-

## 25-1 What is SDLC, How we should start a Project

- SDLC stands for Software Development Life Cycle. It is a structured process used by software developers and project managers to design, develop, test, and deploy high-quality software efficiently. and ast deploy and hand over to customer
  ![alt text](image.png)

The most popular SDLC project approaches used today, especially in modern software development, are:

- 🔥 1. Agile Model (Most Popular Today)
  🔄 Key Features:
  Iterative and incremental

Focus on collaboration, customer feedback, and rapid delivery

Divides the project into small cycles called sprints (usually 1–4 weeks)

Suitable for changing requirements

✅ Best For:
Startups, dynamic projects, web/mobile apps, frequent updates

🔧 Example:
A food delivery app is continuously improved based on user feedback after each sprint.

- 💧 2. Waterfall Model
  📐 Key Features:
  Sequential approach – one phase is completed before the next starts

Easy to understand and manage

No overlap between phases

❌ Limitation:
Not flexible to changes once the development starts

✅ Best For:
Well-defined, small to medium-sized projects with fixed requirements (e.g., government or defense systems)

- 🔁 3. Iterative Model
  🔁 Key Features:
  Starts with basic functionality, then adds features in cycles

Feedback after each iteration helps improve the next version

✅ Best For:
Projects where full requirements are not known upfront

💡 4. Spiral Model
🔄 Key Features:
Combines iterative development with risk analysis

Each phase involves risk assessment, planning, and testing

✅ Best For:
Large, complex, and high-risk projects (e.g., banking software)

- ✅ 5. DevOps Approach (Modern Practice)
  🔧 Key Features:
  Merges development and operations teams

Focuses on automation, continuous integration (CI), and continuous delivery (CD)

Fast and frequent deployments

✅ Best For:
Cloud-based apps, SaaS platforms, large-scale systems

#### We are working on agile model

![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)

- How We Started Ph Tour Management
  ![alt text](image-8.png)

## 25-2 Requirement Analysis of PH Tour Management System

#### Project Name: PH Tour Management System Backend

Version: 1.0
Prepared By: Next Level Team

1. Introduction
   1.1 Purpose
   To develop a scalable, secure, and user-friendly web application that allows users to book tours across Bangladesh, while providing admin and management capabilities for tour operators.
   1.2 Scope
   The system will include modules for:

- User registration and authentication
- Tour listing and filtering
- Booking and payment processing
- Admin panel for managing users, tours, guides, and transactions
- Integration with SSLCommerz for online payments
  1.3 Definitions, Acronyms, Abbreviations
  JWT - JSON Web Token for authentication
  RBAC - Role-Based Access Control
  CRUD - Create, Read, Update, Delete
  SPA - Single Page Application

2. Overall Description
   2.1 Product Perspective
   This is a modular and service-oriented backend designed to be consumed by any frontend (React, Next.js, etc.).
   2.2 User Classes and Characteristics
   Visitor - Unauthenticated users browsing tours
   User - Registered users booking tours
   Admin - Manages users, tours, bookings
3. Functional Requirements
   FR1: User can register using email / Google.
   FR2: OTP is sent and must be verified to activate account.
   FR3: Users can log in using credentials / Google.
   FR4: Authenticated users can view and update their profile.
   FR5: Admin can list, update, or deactivate users.
   FR6: Admin can create, update, delete tours.
   FR7: Tours must include title, description, division, price, images.
   FR8: Users can browse and search tours.
   FR9: Users can filter by division, price, keywords.
   FR10: Users can view detailed tour info.
   FR11: Authenticated users can book a tour with a date.
   FR12: System creates a booking with status `pending`.
   FR13: Users can view their booking history.
   FR14: Admin can update booking status (confirm, cancel).
   FR15: Initiate payment through SSLCommerz.
   FR16: Handle success and failure redirects.
   FR17: Update payment and booking status post-validation.
   FR18: Admin can manage tours, users, and bookings.
   FR19: Admin can assign guides to tours.
   FR20: Admin can manage division listings.
4. Non-Functional Requirements
   NFR1: System should respond within 500ms for 95% of requests.
   NFR2: Should support at least 1,000 concurrent users.
   NFR3: Backend should be horizontally scalable.
   NFR4: Passwords must be hashed (e.g., bcrypt).
   NFR5: JWT tokens must be securely stored and validated.
   NFR6: Role-based access control (RBAC) must be enforced.
   NFR7: Payment data must be securely transmitted using HTTPS.
   NFR8: System must ensure 99.5% uptime.
   NFR9: Redis used for transient data like OTPs must be fault-tolerant.
   NFR10: Code should be modular and follow MVC architecture.
5. System Architecture Overview
   Backend: Node.js (Express), MongoDB, Redis
   Frontend: React/Next.js (separate)
   Auth: JWT, OTP via SMS/Email
   Payment: SSLCommerz
   Deployment: Vercel
6. External Interface Requirements
   User Interface: Separate SPA frontend that consumes JSON APIs.
   API Interface: RESTful APIs structured under `/api/v1`
   Hardware Interface: Hosted on cloud or VPS (e.g., Vercel, AWS, DigitalOcean)
   Software Interface: Compatible with MongoDB Atlas, Redis Cloud, or local deployments
7. Data Requirements
   Key Entities:

- User: name, phone, email, password, role, verified
- Tour: title, description, price, images, division, slug
- Booking: userId, tourId, date, status, paymentStatus
- Payment: bookingId, transactionId, status, amount

8. Use Case Scenarios
   Use Case: Booking a Tour
1. User registers and verifies via OTP.
1. User logs in and browses tours.
1. User selects a tour and submits booking.
1. System creates booking (status: pending).
1. User is redirected to SSLCommerz.
1. On payment success, booking is confirmed.
1. Acceptance Criteria
   Users can register, log in, and book tours
   Admin can manage tours, users, bookings
   Payments update booking statuses correctly
   All APIs are secured and role-protected
   System meets NFRs for performance and security

## 25-3 Workflow of PH Tour Management System

![alt text](image-9.png)
Workflow of the PH Tour Management System

https://gitmind.com/app/docs/mzkbj5o2

## 25-4 Modelling Data for PH Tour Management System

PH Tour Management System Data Modelling

https://docs.google.com/document/d/1NSELQ7_jUx4xLGchef4HT3_9YqDWrdzUUGMZWmD2lY0/edit?tab=t.0

Entities and Their Attributes:
User:

name: String

email: String (unique)

password: String

role: String (e.g., Admin, User)

phone: String

picture: String

address: String

isDeleted: Boolean

isActive: String (e.g., Active, Inactive)

isVerified: Boolean

auths: Array of auth providers (e.g., Google, Facebook)

Tour:

slug: String (unique)

title: String

description: String

images: Array of Strings

location: String

costFrom: Number

startDate: Date

endDate: Date

tourType: ObjectId (references TourType)

included: Array of Strings (e.g., Meals, Transport)

excluded: Array of Strings (e.g., Insurance)

amenities: Array of Strings

tourPlan: Array of Strings (daily itinerary)

TourType:

name: String (e.g., Adventure, Leisure)

Booking:

user: ObjectId (references User)

tour: ObjectId (references Tour)

guestCount: Number

phone: String

address: String

status: String (e.g., Pending, Completed)

payment: ObjectId (references Payment)

Payment:

booking: ObjectId (references Booking)

transactionId: String (unique)

status: String (e.g., Paid, Unpaid, Refunded)

amount: Number

paymentGatewayData: Any

invoiceUrl: String

Relationships:
User → Booking: A user can make multiple bookings.

Tour → Booking: A tour can have many bookings.

Tour → TourType: A tour belongs to one type.

Booking → Payment: A booking has one payment.

## 25-5 How to Make ER Diagram for PH Tour Management System

![alt text](image-10.png)
![alt text](image-11.png)
ER Diagram for PH Tour Management System

https://drive.google.com/file/d/1ASphx7B6gHIKPiiiNf3AB_ZTvdYRBsQz/view?usp=sharing

## 25-6 Create API Endpoints for PH Tour Management System

PH Tour Management System API Endpoints

https://docs.google.com/document/d/1HysoioRCpSsGpSz8JQZRGii9GNkpdx0pEX-zHP2p334/edit?tab=t.0

## 25-7 Setting Up Project with Required Dependencies

- Initialize Git

```bash
git init
```

- Create a development branch

```bash
git checkout -b development
```

#### Project set up

```bash
npm init -y
```

```bash
 npm i -D typescript
```

```bash
tsc --init
```

![alt text](image.png)
![alt text](image-1.png)

```bash
npm i express mongoose zod jsonwebtoken cors dotenv
```

```bash
npm i -D ts-node-dev @types/express @types/cors @types/dotenv @types/jsonwebtoken
```

![alt text](image-2.png)

## 25-9 Setting Up Server and App

- Create server.ts

```ts
import { Server } from "http";

import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect("");
    server = app.listen(5000, () => {
      console.log("Server is Running On Port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
```

- Create app.ts file

```ts
import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome To Tour Management System",
  });
});

export default app;
```

## 25-10 Error Handlers for Server, UnhandledRejection, UncaughtException

```ts
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

// 1 sigterm error

process.on("SIGTERM", () => {
  console.log("SIGTERM signal detected ... server shutting down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//2 unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log("unhandledRejection detected ... server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
Promise.reject(new Error(" I forgot to catch this promise"));

// 3 uncaughtException  rejection error
process.on("uncaughtException", (err) => {
  console.log("uncaughtException detected ... server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

throw new Error("I forgot to handle this local error");
```

## 25-11 Setting Up ES Lint and Fix Errors Using Commands

![alt text](image-12.png)

#### typeScript eslint link setup as like documentation

https://typescript-eslint.io/getting-started/
create eslint file on root folder
![alt text](image-13.png)

## 25-12 Setting Up Environment Variables & Module Summary

![alt text](image-14.png)

```ts
// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  //   tseslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      "no-console": "warn",
    },
  }
);
```

```ts
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "development" | "production";
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV"];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variabl ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
  };
};

export const envVars = loadEnvVariables();
```

```ts
/* eslint-disable no-console */
import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";
import { envVars } from "./config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    console.log("Connected to DB!!");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening to port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
```

# Ph Tour Management Backend-Part 1

## 26-1 Create User interface

```ts
import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}
// auth providers
/**
 * email,password
 * google authentication
 */

export interface IAuthProvider {
  provider: string;
  providerId: string;
}
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}
export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: string;
  role: Role;
  auths: IAuthProvider[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
```

## 26-2 Create User model

```ts
import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { types: String, required: true },
    providerId: { types: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    address: { types: String },
    isDeleted: { types: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { types: Boolean, default: false },

    auths: [authProviderSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = model<IUser>("User", userSchema);
```

## 26-3 Create User controller and route

- user.controller.ts

```ts
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";

import httpStatus from "http-status-codes";
import { User } from "./user.model";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const user = await User.create({
      name,
      email,
    });
    res.status(httpStatus.CREATED).json({
      message: "User Created Successfully",
      user,
    });
  } catch (err: any) {
    console.log(err);
    res.status(httpStatus.BAD_REQUEST).json({
      message: `Something went wrong ${err?.message}`,
      err,
    });
  }
};

export const userControllers = {
  createUser,
};
```

- user.route.ts

```ts
import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

router.post("/register", userControllers.createUser);

export const UserRoutes = router;
```

- app.ts

```ts
import express, { Request, Response } from "express";

import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.route";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", UserRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome To Tour Management System",
  });
});

export default app;
```
