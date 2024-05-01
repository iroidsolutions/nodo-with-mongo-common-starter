import User from "../../model/user";
import { sendMail } from "../common/middleware/sendMail";
import EmailVerification from "../../model/emailVerification";
import authHelper from "../common/helper/auth.helper";
import {
    randomStringGenerator,
    randomNumberGenerator,
    decrypt,
} from "../common/helper/helper";
import {
    ConflictException,
    PreconditionFailedException,
    UnauthorizedException,
    NotFoundException,
} from "../common/error-exceptions";
import AccessToken from "../../model/accessToken";
import getUserResource from "./resources/userResource";
const expiresInSeconds = 31536000;

class authServices {
    /**
     * Register user
     * @param {*} data
     * @returns
     */
    static async register(data, file) {
        const email = data.email.toLowerCase();
        const alreadyExist = await User.findOne({ email: email });
        if (alreadyExist) {
            throw new ConflictException("This email is already registered");
        }

        const hashedPassword = await authHelper.bcryptPassword(
            data.createpassword
        );
        data.createpassword = data.password;
        data.password = hashedPassword;
        data.profileImage = file.filename;
        const register = await User.create(data);

        const alreadyExistCode = EmailVerification.findOne({ email: email });
        if (alreadyExistCode)
            EmailVerification.findByIdAndDelete(alreadyExistCode.id);

        const otp = await randomNumberGenerator(4);
        await EmailVerification.create({
            email: email,
            otp: otp,
        });

        const obj = {
            to: email,
            subject: `Welcome to ${process.env.APP_NAME}`,
            data: { otp },
        };

        sendMail(obj, "sendotp");
        const randomString = randomStringGenerator();

        const token = await authHelper.tokenGenerator({
            id: register._id,
            jti: randomString,
        });

        await authHelper.storeAccessToken(register, randomString);
        register.token = token;

        return {
            ...new getUserResource(register),
            auth: {
                tokenType: "Bearer",
                accessToken: register.token,
                refreshToken: null,
                expiresIn: expiresInSeconds,
            },
        };
    }

    /**
     * Edit email service
     * @param {*} auth
     * @param {*} data
     */
    static async editEmail(auth, data) {
        const find = await User.findOne({ _id: auth._id });
        if (!find) throw new NotFoundException("User not registered");
        const exist = await User.findOne({ email: data.email });
        if (exist)
            throw new ConflictException(
                "This email is already registered"
            );

        const update = await User.findOneAndUpdate(
            find._id,
            {
                email: data.email,
            },
            { new: true }
        );

        const otp = await randomNumberGenerator(4);
        await EmailVerification.create({
            email: data.email,
            otp: otp,
        });

        const obj = {
            to: data.email,
            subject: `Welcome to ${process.env.APP_NAME}`,
            data: { otp },
        };

        sendMail(obj, "sendotp");
    }

    /**
     * @description: Email OTP verification
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async verifyEmailOTP(data) {
        const { email, otp } = data;
        const findUser = await User.findOne({ email: email });
        if (findUser) {
            const findone = await EmailVerification.findOne({ email: email });
            if (findone) {
                const currentTime = new Date(
                    findone.updatedAt.getTime() + 60000
                );
                const time = Date.now();
                if (otp == findone.otp) {
                    if (time < currentTime) {
                        const update = await User.findOneAndUpdate(
                            findUser._id,
                            { isVerify: true },
                            { new: true }
                        );
                        await EmailVerification.findOneAndDelete({
                            email: email,
                        });

                        const randomString = randomStringGenerator();

                        const token = await authHelper.tokenGenerator({
                            id: findUser._id,
                            jti: randomString,
                        });

                        await authHelper.storeAccessToken(update, randomString);
                        update.token = token;

                        return {
                            ...new getUserResource(update),
                            auth: {
                                tokenType: "Bearer",
                                accessToken: update.token,
                                refreshToken: null,
                                expiresIn: expiresInSeconds,
                            },
                        };
                    } else {
                        throw new PreconditionFailedException(
                            "OTP has expired"
                        );
                    }
                } else {
                    throw new PreconditionFailedException("Invalid OTP");
                }
            } else {
                throw new PreconditionFailedException("Invalid OTP");
            }
        } else {
            throw new NotFoundException("User not found");
        }
    }

    /**
     * Resend OTP
     * @param {*} data
     */
    static async resendOtp(auth, data) {
        const alreadyExistCode = await EmailVerification.findOne({
            email: data.email,
        });
        const otp = await randomNumberGenerator(4);
        if (alreadyExistCode) {
            const update = await EmailVerification.findOneAndUpdate(
                alreadyExistCode._id,
                {
                    otp: otp,
                },
                { new: true }
            );
        }

        const obj = {
            to: data.email,
            subject: `Welcome to ${process.env.APP_NAME}`,
            data: { otp },
        };

        sendMail(obj, "sendotp");

        return;
    }

    /**
     * @description Login User
     * @param {*} data
     */
    static async login(data, res) {
        const getExistingUser = await User.findOne({ email: data.email });

        if (!getExistingUser) {
            throw new NotFoundException(
                "Account not exist with this email address"
            );
        }

        if (getExistingUser.isVerify == false) {
            const alreadyExistCode = await EmailVerification.findOne({
                email: data.email,
            });
            const otp = await randomNumberGenerator(4);
            if (alreadyExistCode) {
                const update = await EmailVerification.findOneAndUpdate(
                    alreadyExistCode._id,
                    {
                        otp: otp,
                    },
                    { new: true }
                );
            } else {
                await EmailVerification.create({
                    email: data.email,
                    otp: otp,
                });
            }

            const obj = {
                to: data.email,
                subject: `Welcome to ${process.env.APP_NAME}`,
                data: { otp },
            };
            const randomString = randomStringGenerator();

            const token = await authHelper.tokenGenerator({
                id: getExistingUser._id,
                jti: randomString,
            });

            await authHelper.storeAccessToken(getExistingUser, randomString);

            getExistingUser.token = token;

            sendMail(obj, "sendotp");
            return {
                data: {
                    ...new getUserResource(getExistingUser),
                    auth: {
                        tokenType: "Bearer",
                        accessToken: getExistingUser.token,
                        refreshToken: null,
                        expiresIn: expiresInSeconds,
                    },
                },
            }
        } else {
            const matchedPassword = await authHelper.matchHashedPassword(
                data.password,
                getExistingUser.password
            );

            if (!matchedPassword) {
                throw new PreconditionFailedException("Invalid Password");
            }

            const randomString = randomStringGenerator();
            const update = await User.findOneAndUpdate(
                { _id: getExistingUser._id },
                {
                    isVerify: true,
                },
                { new: true }
            );
            const token = await authHelper.tokenGenerator({
                id: update._id,
                jti: randomString,
            });

            await authHelper.storeAccessToken(update, randomString);

            update.token = token;

            return {
                data: {
                    ...new getUserResource(update),
                    auth: {
                        tokenType: "Bearer",
                        accessToken: update.token,
                        refreshToken: null,
                        expiresIn: expiresInSeconds,
                    },
                },
            }
        }
    }

    /**
     * User logout
     * @param {*} authUser
     * @returns
     */
    static async logout(authUser) {
        await AccessToken.updateOne(
            { token: authUser.jti },
            { isRevoked: true }
        );
        return;
    }
}

export default authServices;
