import Room, { RoomDocument } from '../models/Room';
import UserRoom from '../models/UserRoom';
import CustomError from './customError';
import { v4 as uuidv4 } from 'uuid';
import { Sequelize, Op } from 'sequelize';

export default class RoomController {
    /**
     * Add new room
     * @param {string} name - Room name
     * @param {boolean} visibility - Room visibility
     * @param {number} userId - Room owner
     * @returns {string} - Room ID
     */
    public async createRoom(name: string, description: string, visibility: boolean, userId: number): Promise<number> {
        try {
            const roomData = {
                roomId: uuidv4(),
                name: name,
                description: description,
                private: visibility,
                active: true,
                owner: userId
            };
            
            const room = await Room.create(roomData);
    
            return room.id;   
        } catch (error: any) {
            console.log(error);
            throw new CustomError(`Error creating room: ${error.messsage}`, 500);
        }
    }

    /**
     * Join room
     * @param {number} roomId = Room ID
     * @param {number} userId = User ID
     */
    public async joinRoom(roomId: number, userId: number): Promise<void> {
        try {
            console.log('join room', roomId, userId);
            await UserRoom.create({
                'userId': userId,
                'roomId': roomId
            });

            await Room.increment('userInRoom',
                {
                    'where': {
                        'id': roomId
                    }
                }
            );
        } catch (error: any) {
            console.error(error);
            throw new CustomError(`Error joining room: ${error.messsage}`, 500);
        }
    }

    /**
     * Leave room
     * @param {number} roomId - Room ID 
     * @param {number} userId - User IDs
     */
    public async leaveRoom(roomId: number, userId: number): Promise<void> {
        try {
            await UserRoom.destroy(
                {
                    'where': {
                        'userId': userId,
                        'roomId': roomId
                    }
                }
            );

            await Room.decrement('userInRoom',
                {
                    'where': {
                        'id': roomId
                    }
                }
            );
        } catch (error: any) {
            throw new CustomError(`Error leaving room: ${error.messsage}`, 500);
        }
    }

    /**
     * Check if room is full
     * @param {number} roomId - Room ID 
     * @returns {boolean} - True if room is full or false otherwise
     */
    public async roomIsFull(roomId: number): Promise<boolean> {
        try {
            const room = await Room.findOne({
                'where': {
                    'id': roomId
                }
            });

            if(!room) {
                throw new CustomError('Room not found', 404);
            }
            
            return room.totalUsers === room.userInRoom;   
        } catch (error: any) {
            throw new CustomError(error.messsage, 500);
        }
    }

    /**
     * Get rooms that user is enroll
     * @param {number} userId - User ID 
     * @returns {Array<RoomDocument>} - Room list
     */
    public async getRoomsEnrolled(userId: number): Promise<Array<RoomDocument>> {
        try {
            const userRooms = await UserRoom.findAll({
                'attributes': ['roomId'],
                'where': {
                    'userId': userId
                }
            });

            const roomsId = userRooms.map(userRoom => userRoom.roomId);

            const rooms = await Room.findAll({
                'where': {
                    'id': {
                        [Op.in]: roomsId
                    }
                }
            });
            
            return rooms;
        } catch (error: any) {
            throw Error(error.message);
        }
    }

    /**
     * Get all public rooms
     * @param {number} userId = User ID 
     * @returns {Array<RoomDocument>} - Room list
     */
    public async getAvailableRooms(userId: number): Promise<Array<RoomDocument>> {
        try {
            const userRooms = await UserRoom.findAll({
                'attributes': ['roomId'],
                'where': {
                    'userId': userId
                }
            });

            const roomsId = userRooms.map(userRoom => userRoom.roomId);

            const rooms = await Room.findAll({
                'where': {
                    'id': {
                        [Op.notIn]: roomsId
                    }
                }
            });
            
            return rooms;   
        } catch (error: any) {
            throw Error(error.messsage);
        }
    }

    /**
     * Get room name
     * @param {number} roomId - Room ID 
     * @returns {string} - Room name
     */
    public async getRoomName(roomId: number): Promise<string> {
        try {
            const room = await Room.findOne({
                'attributes': ['name'],
                'where': {
                    'id': roomId,
                }
            });

            if(!room) {
                throw new CustomError('Room not found', 404);
            }

            return room.name;
        } catch (error:any) {
            console.error(error);
            throw new CustomError(`${error.messsage}`, 500);
        }
    }
}
