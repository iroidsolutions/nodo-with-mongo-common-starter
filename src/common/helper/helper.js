import path from "path"
import fs from "fs"
import CryptoJS from "crypto-js"
const secretKey = process.env.SECRET_KEY
/**
 * random string generator
 * @param {*} givenLength 
 * @returns 
 */
export const randomStringGenerator = (givenLength = 70) =>{
    const characters = 
    givenLength > 10
    ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    : "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" ;

    const length = givenLength;
    let randomStr = "";

    for(let i = 0; i< length; i++){
        const randomNum = Math.floor(Math.random() * characters.length);
        randomStr += characters[randomNum];
    }
    return randomStr
}

/**
 * randomString : generate random string for given length
 * @param {number} length : length of random string to be generated (default 75)
 * @return {number} : generated random string
 */
export const randomNumberGenerator = (givenLength = 5) => {
    const characters = "123456789";
    const length = givenLength;
    let randomStr = "";
  
    for (let i = 0; i < length; i++) {
      const randomNum = Math.floor(Math.random() * characters.length);
      randomStr += characters[randomNum];
    }
    return randomStr;
  };

 
  /**
 * unlinkFile : remove files from folder
 * @param filename : file name store in database
 * @return { boolean } : true/false
 */
export const unlinkFile = async (filename) => {
    const img = path.join(`${__dirname}` + `../../../../${filename}`);
  
    if (fs.existsSync(img)) {
      try {
        fs.unlinkSync(img);
        return true;
      } catch (error) {
        console.error("Error while deleting the file:", error);
      }
    } else {
      console.log("File does not exist.");
    }
  
    return false;
  };


  export const SuccessResponceHandle = (statusCode, message,data)=>{
    return {
      status : statusCode,
      message : message,
      data: data
    }
  }

















