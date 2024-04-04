import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { config } from 'dotenv'; config();
import { connectDb } from './Config/database';
import indexRoutes from './Routes';
import errorHandler from './Middlewares/errorHandler';
import passportConfig from './Config/passport';
import { authenticate } from './Middlewares/authenticate';
const port = process.env.PORT || 3000;

const app = express();

connectDb();

passportConfig(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(indexRoutes);

app.use('/protected', authenticate, (req, res) => {
    res.status(200).json({ message: 'You are authorized to view this page!', success: true });
});



app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});