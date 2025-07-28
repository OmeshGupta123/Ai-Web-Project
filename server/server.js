import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

await connectCloudinary();

app.get("/",(req,res) => {
    res.send("server is live")
})

app.use(requireAuth());

app.use('/api/ai',aiRouter);
app.use('/api/ai/user',userRouter);

app.listen(PORT, () => {
    console.log("Server is listening https:/localhost:",PORT);
})