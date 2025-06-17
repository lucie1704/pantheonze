import express, { Express, Router } from "express";
import dotenv from "dotenv";
import cors from 'cors'
import pastryRoutes from './routes/pastry.routes'

import RouteLoader from "./RouteLoader.ts";

dotenv.config();

const app: Express = express();
app.use(express.json());
const INTERNAL_PORT = process.env.INTERNAL_SERVICE_PORT;
const EXPOSED_PORT = process.env.SERVICE_PORT;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET MUST BE DEFINED IN YOUR .ENV FILE");
}

const routes = await RouteLoader();
app.use("/", routes);

// Middleware
app.use(cors())

// Routes
const pastryRouter = Router();
app.use('/api/pastries', pastryRoutes(pastryRouter))

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  })
})

app.listen(INTERNAL_PORT, () => {
  console.log(`[MY-SERVICE]: MY-SERVICE is running at http://localhost:${EXPOSED_PORT}`);
});
