import express, { Request, Response} from 'express';
import RoomController from '../controllers/room';
import ChatController from '../controllers/chat';

const router = express.Router();

/**
 * POST - Create new room
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object. 
 */
router.post('/new', async (req: Request, res: Response) => {
    try {
        const roomController = new RoomController();
        
        const roomId = await roomController
            .createRoom(
                req.body.name,
                req.body.description,
                req.body.visibility,
                req.body.userId);

        return res.status(201).send({
            'roomId': roomId,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Something went wrong'
        });
    }
});

/**
 * GET - Get all public rooms
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object. 
 */
router.get('/availables', async (req: Request, res: Response) => {
    try {
        const roomController = new RoomController();

        const rooms = await roomController
            .getAvailableRooms(req.query.userId as string);

        if(rooms.length > 0) {
            return res.status(200).send({
                rooms: rooms,
            });
        } else {
            return res.status(404).send({
                rooms: rooms,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Something went wrong'
        });
    }
});

/**
 * GET - Get rooms that user is enroll
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object. 
 */
router.get('/enrolled', async (req: Request, res: Response) => {
    try {
        const roomController = new RoomController();

        const rooms = await roomController.
            getRoomsEnrolled(req.query.userId as string);

        if(rooms.length > 0) {
            return res.status(200).send({
                rooms: rooms,
            });
        } else {
            return res.status(404).send({
                rooms: rooms,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Something went wrong'
        });
    }
});

/**
 * GET - Get message history
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object. 
 */
router.get('/history', async (req: Request, res: Response) => {
    try {        
        const chatController = new ChatController();

        const messages = await chatController.
            getMessageHistory(req.query.roomId as string);
        
        if(messages.length > 0) {
            return res.status(200).send({
                messages: messages,
            });
        } else {
            return res.status(404).send({
                messages: messages,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: 'Something went wrong'
        });
    }
});

export default router;
