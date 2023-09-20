import Room, { RoomDocument } from '../models/Room';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

export default class RoomController {
    /**
     * Add new room
     * @param {string} name - Room name
     * @param {boolean} visibility - Room visibility
     * @param {string} userId - Room owner
     * @returns {string} - Room ID
     */
    public async createRoom(name: string, description: string, visibility: boolean, userId: string): Promise<string> {
        try {
            const roomData = {
                roomId: uuidv4(),
                name: name,
                description: description,
                private: visibility,
                active: true,
                owner: userId
            };
            
            const newRoom = new Room(roomData);
            
            await newRoom.save();
    
            return newRoom.roomId;   
        } catch (error: any) {
            console.log(error);
            throw Error(`Error creating room: ${error.messsage}`);
        }
    }

    /**
     * Join room
     * @param {string} roomId = Room ID
     * @param {string} userId = User ID
     */
    public async joinRoom(roomId: string, userId: string): Promise<void> {
        try {
            await Room.updateOne(
                { 'roomId': roomId },
                { 
                    '$inc': { 'userInRoom': 1 },
                    '$push': { 'users': userId } 
                }
            );

            await User.updateOne(
                { 'userId': userId },
                {
                    '$push': { 'rooms': roomId } 
                }
            );
        } catch (error: any) {
            throw Error(`Error joining room: ${error.messsage}`);
        }
    }

    /**
     * Leave room
     * @param {string} roomId - Room ID 
     * @param {string} userId - User IDs
     */
    public async leaveRoom(roomId: string, userId: string): Promise<void> {
        try {
            await Room.updateOne(
                { 'roomId': roomId },
                { 
                    '$inc': { 'userInRoom': -1 },
                    '$pull': { 'users': userId } 
                }
            );

            await User.updateOne(
                { 'userId': userId },
                {
                    '$pull': { 'rooms': roomId } 
                }
            );
        } catch (error: any) {
            throw Error(`Error leaving room: ${error.messsage}`);
        }
    }

    /**
     * Check if room is full
     * @param {string} roomId - Room ID 
     * @returns {boolean} - True if room is full or false otherwise
     */
    public async roomIsFull(roomId: string): Promise<boolean> {
        try {
            const room = await Room.findOne({'roomId': roomId}).exec();
            
            return room?.totalUsers === room?.userInRoom;   
        } catch (error: any) {
            throw Error(error.messsage);
        }
    }

    /**
     * Get rooms that user is enroll
     * @param {string} userId - User ID 
     * @returns {Array<RoomDocument>} - Room list
     */
    public async getRoomsEnrolled(userId: string): Promise<Array<RoomDocument>> {
        try {
            let transactiontAggregate = [];

            transactiontAggregate.push({
                '$match': {
                    'userId': userId,
                }
            }, {
                '$lookup': {
                    'from': 'Room',
                    'localField': 'rooms',
                    'foreignField': 'roomId',
                    'as': 'rooms'
                }
            }, {
                '$project': {
                    'rooms': 1
                }
            });

            const user = await User.aggregate(transactiontAggregate);

            return user.length > 0? user[0].rooms : [];
        } catch (error: any) {
            throw Error(error.message);
        }
    }

    /**
     * Get all public rooms
     * @returns {Array<RoomDocument>} - Room list
     */
    public async getAvailableRooms(userId: string): Promise<Array<RoomDocument>> {
        try {
            const user = await User.findOne({'userId': userId}).exec();

            const rooms = await Room.find(
                {
                    'active': true,
                    'private': false,
                    'roomId': {
                        '$nin': user?.rooms,
                    }
                }
            ).exec();
            
            return rooms;   
        } catch (error: any) {
            throw Error(error.messsage);
        }
    }

    public async getRoomName(roomId: string): Promise<string> {
        try {
            const room = await Room.findOne(
                {
                    'roomId': roomId
                }
            ).exec();

            return room?.name?? '';
        } catch (error:any) {
            throw Error(error.messsage);
        }
    }
}
