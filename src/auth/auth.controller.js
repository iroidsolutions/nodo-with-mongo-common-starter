import authServices from "./auth.services"
import {SuccessResponceHandle} from "../common/helper/helper"


class authController {

    /**
     * Register user
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async register(req, res) {
        const data = await authServices.register(req.body,req.file)
        return res.send(SuccessResponceHandle(201,"OTP sent to you email address",data))
    }

       /**
     * Register user
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
       static async editEmail(req, res) {
        const data = await authServices.editEmail(req.user,req.body)
        return res.send(SuccessResponceHandle(203,"OTP sent to your mail",null))
    }

    /**
     * Verify OTP
     * @param {*} req 
     * @param {*} res 
     */
    static async verifyEmailOTP(req, res) {
        const data = await authServices.verifyEmailOTP(req.body)
        return res.send(SuccessResponceHandle(202,"Email Verified sucessfully"));
    }

    /**
     * Resend OTP
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async resendOtp(req,res){
        const data = await authServices.resendOtp(req.user,req.body)
        return res.send(SuccessResponceHandle(203,"OTP sent to your mail",null))
    }

    /**
 * @description Login User
 * @param {*} req
 * @param {*} res
 */
    static async login(req, res) {
        const data = await authServices.login(req.body,res);
        return res.send(SuccessResponceHandle(200,"Success",data))
    }

    /**
   * @description Login User
   * @param {*} req
   * @param {*} res
   */
    static async logout(req, res) {
        await authServices.logout(req.user);
        return res.send(SuccessResponceHandle(202,"Loged out successfully",null))
      
    }

}

export default authController