import express from 'express';
import AuthController from '../controllers/authController.js';

export const AuthRouter= express.Router()

// => Crearte an instance of AuthController
const authController = new AuthController()

AuthRouter.post("/register",(req,res)=>authController.registerUser(req,res));
AuthRouter.post("/login",(req,res)=>authController.loginUser(req,res));
AuthRouter.post("/verify-otp",(req,res)=>authController.verifyOtp(req,res));