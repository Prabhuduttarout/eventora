import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDBUsingMongoose } from './src/config/mongoose.js';
import { AuthRouter} from './src/routes/authRouter.js';
import { EventRouter } from './src/routes/eventRouter.js';
import { BookingRouter } from './src/routes/bookingRouter.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//=> Routes

// @ Auth Routes
app.use("/api/auth",AuthRouter);
// @ Event Routes
app.use("/api/events", EventRouter);
// @ Booking Routes
app.use("/api/bookings", BookingRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDBUsingMongoose()
});