/**
 * Get base url
 * @param {*} path 
 * @returns 
 */
require("dotenv").config();


module.exports.baseUrl = (path = null) => {
    let url = `${process.env.BASE_URL}:${process.env.PORT}`;
    if(process.env.ENV !== "production"){
        url = `${process.env.BASE_URL}:${process.env.PORT}`;
    }
    return url + (path ? `${path}` : "")
}