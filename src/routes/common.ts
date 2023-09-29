import express, { Request, Response} from 'express';
import PingController from '../controllers/ping';
import cors from 'cors';

const router = express.Router();

router.use(cors({
  origin: process.env.APP_ORIGIN_URL,
  allowedHeaders: ['Content-Type', 'jwt-token'],
  methods: ['GET', 'POST', 'OPTIONS'],
}));

/**
 * GET - Check healthy of API
 * @param {Object} req - The express request object.
 * @param {Object} res - The express response object. 
 */
router.get('/ping', async (req: Request, res: Response) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  
  return res.send(response);
});

export default router;
