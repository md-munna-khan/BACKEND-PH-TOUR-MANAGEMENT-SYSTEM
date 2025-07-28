import { Router } from "express";
import { UserRoutes } from "../user/user.route";
import { AuthRoutes } from "../auth/auth.route";
import { DivisionRoutes } from "../division/division.route";
import { TourRoutes } from "../tour/tour.route";
import { BookingRoutes } from "../booking/booking.route";
import { PaymentRoutes } from "../payment/payment.route";
import { OtpRoutes } from "../otp/otp.route";



 export const router = Router()

const moduleRoutes=[
    {
        path:"/user",
        route:UserRoutes
    },
    {
        path:"/auth",
        route:AuthRoutes
    },
    {
        path:"/division",
        route:DivisionRoutes
    },
     {
        path: "/tours",
        route: TourRoutes
    },
     {
        path: "/booking",
        route: BookingRoutes
    },
     {
        path: "/payment",
        route:PaymentRoutes
    },
     {
        path: "/otp",
        route:OtpRoutes
    }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})