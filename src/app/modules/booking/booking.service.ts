/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from 'http-status-codes';
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import AppError from "../../errorHelpers/app.error";


const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}

const createBooking = async (payload: Partial <IBooking>,userId:string) => {
const transactionId = getTransactionId()

const session =await Booking.startSession();
session.startTransaction()
try {
    
    const user =await User.findById(userId)


if(!user?.phone|| !user?.address){
         throw new AppError(httpStatus.BAD_REQUEST, "Please Add Phone Number and Address In Your Profile For Booking!")
}

const tour = await Tour.findById(payload.tour).select("costFrom")
if(!tour?.costFrom){
        throw new AppError(httpStatus.BAD_REQUEST, "Tour Cost is Not Added!, Wait Until Cost Is Added!")
}

const amount =Number(tour.costFrom) * Number(payload.guestCount!)

const booking =await Booking.create([
    {
    user:userId,
    status:BOOKING_STATUS.PENDING,
    ...payload
}
],{session})

const payment = await Payment.create([
    {
    booking:booking[0]._id,
    status:PAYMENT_STATUS.UNPAID,
    transactionId:transactionId,
    amount:amount

}
],{session})

const updatedBooking = await
 Booking.findByIdAndUpdate(
    booking[0]._id,
    {payment:payment[0]._id},
    {new:true,runValidators:true,session}
 )
 .populate("user","name email phone address")
 .populate("tour","title costFrom")
 .populate("payment")
 await session.commitTransaction()// transaction
 session.endSession()
 return updatedBooking
    
} catch (error) {
    
   await session.abortTransaction() // rollback
   session.endSession()
   throw error
}

};

const getUserBookings = async () => {

    return {}
};

const getBookingById = async () => {
    return {}
};

const updateBookingStatus = async (

) => {

    return {}
};

const getAllBookings = async () => {

    return {}
};

export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};