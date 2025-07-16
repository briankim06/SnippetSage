import express from 'express';
import connectDB from './config/db';
import snippetsRoutes from './routes/snippetsRoutes';
import registerRoutes from './routes/registerRoutes';
import loginRoutes from './routes/loginRoutes';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();


app.use(express.json());
app.use('/api/snippets', snippetsRoutes)
app.use('/api/register', registerRoutes)
app.use('/api/login', loginRoutes)

// app.get('/api/notes', (req, res) => {
//     res.send('Hello World');
// });

connectDB().then(() => app.listen(PORT, () => {
    console.log(`Server is running on port ` + PORT);
}));


