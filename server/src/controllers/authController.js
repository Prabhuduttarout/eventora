import { OTP } from "../models/OTP.js";
import { User } from "../models/User.js";
import { sendOTPEmail } from "../utils/email.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class AuthController{
    generateOTP(){
        return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    }
    generateToken = (id, role) => {
        return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    };
    async registerUser(req,res){
        const {name,email,password} = req.body;

        // check if the user is already registered
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({error:"User already exists"});
        }

        const hassedPassword = await bcrypt.hash(password,10);
        try{
            const newUser = new User({name,email,password:hassedPassword});
            await newUser.save();
           
            // Create OTP and send it to the user's email
            const otp = this.generateOTP();

            // Store the OTP in the database for verification later
            await OTP.create({email,otp:otp.toString(),action:"account_verification"});
            
            // Send the OTP to the user's email
            await sendOTPEmail(email, otp.toString(), 'account_verification');

            // Send the response back to the client
            res.status(201).json({message:"User registered successfully. Please verify your email with the OTP sent.",email:email});

        }catch(err){
             res.status(400).json({error:err.message});
        }
    }

    async loginUser(req,res){
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ message: 'Invalid credentials' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

            if (!user.isVerified && user.role !== 'admin') {
                const otp = this.generateOTP();
                await OTP.findOneAndDelete({ email: user.email, action: 'account_verification' });
                await OTP.create({ email: user.email, otp, action: 'account_verification' });
                await sendOTPEmail(user.email, otp, 'account_verification');
                return res.status(403).json({ message: 'Account not verified', needsVerification: true, email: user.email });
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: this.generateToken(user.id, user.role)
            });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }

    async verifyOtp(req,res){
        try {
            const { email, otp } = req.body;
            const validOTP = await OTP.findOne({ email, otp, action: 'account_verification' });

            if (!validOTP) {
                return res.status(400).json({ message: 'Invalid or expired OTP' });
            }

            const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { returnDocument: 'after' });
            await OTP.deleteOne({ _id: validOTP._id }); // Delete OTP after usage

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: this.generateToken(user.id, user.role)
            });
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }
}