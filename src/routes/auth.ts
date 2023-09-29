import express, { Request, Response } from 'express';
import UserController from '../controllers/user';

const router = express.Router();

/**
 * POST - Add user
 * @param {Object} req - The express request object.
 * @param {Object} res - The express response object.
 */
router.post('/signup', async (req: Request, res: Response) => {
    try {
        const controller = new UserController();

        const userExist = await controller.userExist(req.body.nickname);

        if(userExist) {
            return res.status(400).send('User already exists');
        }

        await controller.addUser(req.body.nickname, req.body.password);
    
        return res.status(201).send();   
    } catch (error: any) {
        console.error(error);
        res.status(error.code).send({
            'message': error.message
        });
    }
});

/**
 * POST - Login
 * @param {Object} req - The express request object.
 * @param {Object} res - The express response object.
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        const controller = new UserController();

        const user = await controller.login(req.body.nickname, req.body.password);

        return res.status(200).send(user);
    } catch (error: any) {
        console.error(error);
        res.status(error.code).send({
            'message': error.message
        });
    }
});

export default router;
