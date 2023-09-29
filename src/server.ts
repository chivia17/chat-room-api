import express, {Application} from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import commonRoutes from './routes/common';
import roomRoutes from './routes/room';
import authRoutes from './routes/auth'
import UserController from './controllers/user';
import RoomController from './controllers/room';
import ChatController from './controllers/chat';

const app: Application = express();

app.use(express.json());
app.use('/', commonRoutes);
app.use('/room', roomRoutes);
app.use('/user', authRoutes);

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.APP_ORIGIN_URL
    }
});

io.of('/chat').on('connection', (socket) => {
    console.log('User connected', socket.id);

    /**
     * Link socket ID with nickname
     */
    socket.on('new-user', async ({nickname}) => {
        try {
            await new UserController().addUser(nickname, socket.id);
            console.log('User linked');   
        } catch (error: any) {
            socket.in(socket.id).emit('error', {message: error.message})
        }
    });

    /**
     * Join room
     */ 
    socket.on('join', async ({room, nickname, userId}, ack) => {
        try {
            await new RoomController().joinRoom(room, userId);

            socket.join(room);

            const roomName = await new RoomController().getRoomName(room);
        
            socket.in(room).emit('notification', 
                {
                    'key': 'member-in',
                    'title': 'Someone\'s here',
                    'description': `${nickname} just entered room: ${roomName}` 
                }
            );
        
            console.log(`${socket.id} joined room: ${room}`);

            ack({ status: 'success', message: `You joined room: ${room}` });
        } catch (error: any) {
            socket.in(socket.id).emit('error', {message: error.message})
            ack({ status: 'error', message: error.message });
        }
    });

    /**
     * Re join rooms
     */
    socket.on('re-join', async({userId}) => {
        try {
            const myRooms = await new RoomController().getRoomsEnrolled(userId);

            myRooms.forEach((room) => {
                socket.join(room.id.toString());
                console.log(`Re join room: ${room.id} :${userId}`)
            })
        } catch (error: any) {
            socket.in(socket.id).emit('error', {message: error.message});
        }
    })
    
    /**
     * Leave room
     */
    socket.on('leave', async ({room, nickname, userId}, ack) => {
        try {
            socket.leave(room);

            await new RoomController().leaveRoom(room, userId);

            io.in(room).emit('notification', 
                {
                    'key': 'member-out',
                    'title': 'Someone just left',
                    'description': `${nickname} just left the room`
                }
            );

            console.log(`${socket.id} left room: ${room}`);

            ack({ status: 'success', message: `You leave room: ${room}` });
        } catch (error: any) {
            socket.in(socket.id).emit('error', {message: error.message})
            ack({ status: 'error', message: error.message });
        }
    });
    
    /**
     * Receive and send message
     */
    socket.on('message', async ({room, message, nickname, userId}) => {
        try {
            console.log(`Message to ${room}: ${message}`);

            await new ChatController().addMessage(room, message, userId, 'text', nickname);
            
            socket.in(room).emit('message', 
                {
                    'room': room,
                    'message': message,
                    'userId': userId,
                    'nickname': nickname
                }
            );
        } catch (error: any) {
            socket.in(socket.id).emit('error', {message: error.message});
        }
    });

    /**
     * Send join channel invitation
     */
    socket.on('invitation', ({room, userId, userIdToInvite}) => {
        socket.in(userIdToInvite).emit('notification', 
            {
                'key': 'invitation',
                'title': `${userId} sent you an invitation.`,
                'description': `Erick wants you to join his channel. ${room}`
            }
        );
    });

    /**
     * User disconnected
     */
    socket.on('disconnect', async () => {
        try {
            console.log(`User disconnected: ${socket.id}`); 
        } catch (error) {
            console.error(error);
        }
    })
});

export default server;