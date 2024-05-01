require("dotenv").config();

import express from "express"
import path from "path"
import fs from "fs"
import session from "express-session"
import passport from "passport";
import { mongoConnection } from "./model/connection"
import swagger from "./src/common/config/swagger";
import routes from "./routes/index"
import handleError from "./src/common/middleware/error-handler"
import "./src/common/config/jwt-strategy"
import flash from "connect-flash"
import http from "http"
import { baseUrl } from "./src/common/config/constants"
import bodyParser from "body-parser"




const app = express();
mongoConnection();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
    secret: "hjs89d",
    resave: false,
    saveUninitialized: true
}))
app.use(bodyParser.json());


app.use(passport.initialize());
app.use(passport.session())


app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "media")))


app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(flash());
app.use(function (req, res, next) {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});



app.get("/", (req, res) => {
    return res.render("errors/500")
})

app.use("/api/documentation", swagger);
app.use("/", routes)
app.use(handleError)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});
const server = http.Server(app)

const isSecure = process.env.IS_SECURE == "true";

if (isSecure) {
   
    var options = {
        key: fs.readFileSync(`${process.env.SSL_SERT_BASE_PATH}/privkey.pem`),
        cert: fs.readFileSync(`${process.env.SSL_SERT_BASE_PATH}/cert.pem`),
        ca: [
            fs.readFileSync(`${process.env.SSL_SERT_BASE_PATH}/cert.pem`),
            fs.readFileSync(`${process.env.SSL_SERT_BASE_PATH}/fullchain.pem`)
        ],
    };


    var https = require("https").Server(options, app);

    https.listen(process.env.PORT, () => {
        console.log(`Https server is running on https://${process.env.BASE_URL}:${process.env.PORT}`);

    });

} else {

    server.listen(process.env.PORT, () => {
        console.log(`listening at ${process.env.BASE_URL}:${process.env.PORT}`)
    })
}