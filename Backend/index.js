import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectionDB } from './config/connectionDB.js'
import userRoutes from './Routes/user.routes.js'
import blogRoutes from './Routes/blog.routes.js'
import upload from './Middlewares/multer.js'
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('trust proxy', 1);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://insight-hub-1ian.vercel.app"
  ],
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) return;
  try {
    await connectionDB();
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
    throw error;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: "Database connection failed", details: error.message });
  }
});

//api endpoint
app.use('/user', userRoutes)
app.use('/blog', blogRoutes)


if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}


export default app;