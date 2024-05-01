import express from "express";
import authRoutes from "../src/auth/auth.router"
import userRoutes from "../src/user/user.router"

const router = express.Router();


router.use("/auth", authRoutes);
router.use("/user", userRoutes);


export default router;