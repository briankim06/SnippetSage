import express from 'express';
import connectDB from './config/db';
import snippetsRoutes from './routes/snippetsRoutes';
import registerRoutes from './routes/registerRoutes';

const app = express();


app.use(express.json());
app.use('/api/snippets', snippetsRoutes)
app.use('/api/register', registerRoutes)

// app.get('/api/notes', (req, res) => {
//     res.send('Hello World');
// });

connectDB().then(() => app.listen(5001, () => {
    console.log('Server is running on port 5001');
}));


