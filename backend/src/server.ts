import express from 'express';
import connectDB from './config/db';
import snippetsRoutes from './routes/snippetsRoutes';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';
import { checkAuth } from './middleware/checkAuth';
import { latencyMetric } from './middleware/latencyMetric';

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();


app.use(express.json());
app.use(checkAuth);
app.use(latencyMetric);
app.use('/api/snippets', snippetsRoutes)
app.use('/api/auth', authRoutes)



connectDB().then(() => app.listen(PORT, () => {
    console.log(`Server is running on port ` + PORT);
}));


