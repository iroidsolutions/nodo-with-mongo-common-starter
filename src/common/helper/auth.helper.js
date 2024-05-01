import bcrypt from "bcryptjs"
import { BCRYPT, JWT } from "../constants/constant"
import jwt from "jsonwebtoken"
import AccessToken from "../../../model/accessToken"
import moment from "moment"

const Hours = 8760;

class authHelper{

    /**
     * @description : Bcrypt password
     * @param {*} password 
     */

    static async bcryptPassword(password) {
        const hashedPassword = await new Promise((resolve, reject) => {
          bcrypt.hash(password, BCRYPT.SALT_ROUND, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
          });
        });
        return hashedPassword;
      }
    /**
     * JWT Token Generator
     * @param {*} data 
     * @returns 
     */
    static async tokenGenerator(data){
        return await jwt.sign(data, JWT.SECRET,{expiresIn : JWT.EXPIRES_IN})
    }
    
    /**
     * Store access token to database
     * @param {*} user 
     * @param {*} cryptoString 
     * @returns 
     */
    static async storeAccessToken(user,cryptoString){
        const expiredAt = moment(new Date())
        .utc()
        .add(Hours,"hours")
        .format("YYYY-MM-DD hh:mm:ss");

        await AccessToken.create({
            token : cryptoString,
            userId : user._id,
            expires_at : expiredAt
        })
        return true
    }




   /**
   * @description matched password
   * @param {*} password 
   * @param {*} userPassword 
   * @returns 
   */
  static async matchHashedPassword(password, userPassword) {
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.compare(password, userPassword, (err, res) => {
        if (err) reject(err);
        resolve(res);
       
      });
    });
   
    return hashedPassword;
  }
}

export default authHelper