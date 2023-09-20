import User from '../models/User';
import Room from '../models/Room';

export default class UserController {
    /**
     * Add new user
     * @param {string} nickname - Nickname
     * @param {string} userId - Socket ID
     * @returns {string} - User ID
     */
    public async addUser(nickname: string, userId: string): Promise<void> {
        try {
            const userData = {
                userId: userId,
                nickname: nickname,
                active: true
            };
    
            const newUser = new User(userData);
            
            await newUser.save(); 
        } catch (error: any) {
            console.error(error);
            throw Error(`Error saving new user: ${error.messsage}`);
        }
    }

    /**
     * Update user status
     * @param {string} userId - User ID
     * @param {boolean} status - New user status
     */
    public async updateStatus(userId: string, status: boolean): Promise<void> {
        try {
            await User.updateOne({ 
                'userId' : userId
            },{ 
                '$set': {
                    'active': status
                }
            });   
        } catch (error: any) {
            throw Error(`Error updating status: ${error.messsage}`);
        }
    }

    /**
     * Delete user data and remove from all joined rooms
     * @param {string} userId - User ID
     */
    public async removeUser(userId: string): Promise<void> {
        try {
            const user = await User.findOne({ 'userId': userId }).exec();

            if(!user) {
                return;
            }

            if (user.rooms.length > 0) {
                await Room.updateMany(
                    { 'roomId': {
                            '$in': user.rooms
                        } 
                    },
                    {
                        '$inc': { 'userInRoom': -1 },
                        '$pull': { 'users': user.userId }
                    }
                )
            }

            await user.deleteOne();

        } catch (error: any) {
            throw Error(`Error deleting user: ${error.messsage}`);
        }
    }
}