import express from 'express';
import connectDB from './config/db';
import snippetsRoutes from './routes/snippetsRoutes';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import { latencyMetric } from './middleware/latencyMetric';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());
app.use(latencyMetric);
app.use('/api/snippets', snippetsRoutes)
app.use('/api/auth', authRoutes)



connectDB().then(() => app.listen(PORT, () => {
    console.log(`Server is running on port ` + PORT);
}));


