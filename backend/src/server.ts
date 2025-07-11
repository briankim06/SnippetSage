import express from 'express';
import connectDB from './config/db';

const app = express();
connectDB();

app.get('/api/notes', (req, res) => {
    res.send('Hello World');
});

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});


