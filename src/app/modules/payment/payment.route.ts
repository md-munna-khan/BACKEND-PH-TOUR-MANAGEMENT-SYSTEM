
import express from "express";
import { PaymentController } from "./payment.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middleware/checkAuth";


const router = express.Router();

router.post("/init-payment/:bookingId", PaymentController.initPayment);
router.post("/success", PaymentController.successPayment);
router.post("/fail", PaymentController.failPayment);
router.post("/cancel", PaymentController.cancelPayment);
router.get("/invoice/:paymentId", checkAuth(...Object.values(Role)), PaymentController.getInvoiceDownloadUrl);

// for ssl commerz payment validation
router.post("/validate-payment", PaymentController.validatePayment)
export const PaymentRoutes = router;