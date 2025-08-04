
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";

import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import AppError from "../../errorHelpers/app.error";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { sendEmail } from "../../utils/sendEmail";

const initPayment = async (bookingId: string) => {

    const payment = await Payment.findOne({ booking: bookingId })

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found. You have not booked this tour")
    }

    const booking = await Booking.findById(payment.booking)

    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).name

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await SSLService.sslPaymentInit(sslPayload)

    return {
        paymentUrl: sslPayment.GatewayPageURL
    }

};
const successPayment = async (query: Record<string, string>) => {

    // Update Booking Status to COnfirm 
    // Update Payment Status to PAID

    const session = await Booking.startSession();
    session.startTransaction()

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.PAID,
        }, { new: true, runValidators: true, session: session })
          if (!updatedPayment) {
 throw new AppError(httpStatus.NOT_FOUND, "Not payment Found")
    }

      const updatedBooking =   await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                {new:true, runValidators: true, session }
            ).populate("tour","title")
            .populate("user","name email")

  if (!updatedBooking) {
 throw new AppError(httpStatus.NOT_FOUND, "Not Updated booking Found")
    }

const invoiceData :IInvoiceData={
    bookingDate:updatedBooking?.createdAt as Date,
    guestCount:updatedBooking.guestCount,
    totalAmount:updatedPayment.amount,
    tourTitle:(updatedBooking.tour as unknown as ITour).title,
    transactionId:updatedPayment.transactionId,
    userName:(updatedBooking.tour as unknown as IUser).name,

}

const pdfBuffer = await generatePdf(invoiceData)

  await sendEmail({
            to: (updatedBooking.user as unknown as IUser).email,
            subject: "Your Booking Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    fileName: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        })


        await session.commitTransaction(); //transaction
        session.endSession()
        return { success: true, message: "Payment Completed Successfully" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
        throw error
    }
};
const failPayment = async (query: Record<string, string>) => {

    // Update Booking Status to FAIL
    // Update Payment Status to FAIL

    const session = await Booking.startSession();
    session.startTransaction()

    try {


        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.FAILED,
        }, { new: true, runValidators: true, session: session })

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.FAILED },
                { runValidators: true, session }
            )

        await session.commitTransaction(); //transaction
        session.endSession()
        return { success: false, message: "Payment Failed" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
        throw error
    }
};
const cancelPayment = async (query: Record<string, string>) => {

    // Update Booking Status to CANCEL
    // Update Payment Status to CANCEL

    const session = await Booking.startSession();
    session.startTransaction()

    try {


        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.CANCELLED,
        }, { runValidators: true, session: session })

        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.CANCEL },
                { runValidators: true, session }
            )

        await session.commitTransaction(); //transaction
        session.endSession()
        return { success: false, message: "Payment Cancelled" }
    } catch (error) {
        await session.abortTransaction(); // rollback
        session.endSession()
        // throw new AppError(httpStatus.BAD_REQUEST, error) ❌❌
        throw error
    }
};


export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};