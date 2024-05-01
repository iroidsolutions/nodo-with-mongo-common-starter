import express from "express"
import authController from "./auth.controller"
import asycHandler from "express-async-handler"
import validator from "../common/config/joi-validator"
import authenticateUser from "../common/middleware/authenticate"
import { registerDto, loginDto, verifyEmailOtpDto,editEmail } from "./dto/auth.dto";
import storeFiles from "../common/middleware/store-files";
import auth from "../common/middleware/authenticate"
const router = express.Router();

router.post(
  "/register",
  storeFiles('media/profile', 'profileImage'),
  validator.body(registerDto),
  asycHandler(authController.register)
);

router.post(
  '/edit-email',auth,
  validator.body(editEmail),
  asycHandler(authController.editEmail))

router.post(
  "/login", validator.body(loginDto),
  asycHandler(authController.login)
);

router.post(
  '/verify-otp',auth,
  validator.body(verifyEmailOtpDto),
  asycHandler(authController.verifyEmailOTP))

router.post(
  '/resend-otp',auth,
  asycHandler(authController.resendOtp))

router.get(
  "/logout", authenticateUser,
  asycHandler(authController.logout)
);


export default router


