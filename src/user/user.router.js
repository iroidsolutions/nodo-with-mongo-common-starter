import express from "express"
import userController from "./user.controller"
import asycHandler from "express-async-handler"
import validator from "../common/config/joi-validator"
import {forgot,editProfile} from "./dto/user.dto"
import authenticateUser from "../common/middleware/authenticate"
import storeFiles from "../common/middleware/store-files";


const router = express.Router();


router.post("/forgot-password", validator.body(forgot),asycHandler(userController.forgotPassword));
router.get("/forgotPage/:token", asycHandler(userController.forgotPage));
router.post("/forgotPage/:token", asycHandler(userController.resetPassword));
router.put('/profile', authenticateUser,storeFiles('media/profile', 'profileImage'), validator.body(editProfile), asycHandler(userController.profile));
router.get('/profile',authenticateUser,asycHandler(userController.getProfile)) 


export default router


