import ChatHistory, { MessageDocument } from '../models/ChatHistory';
import CustomError from './customError';

export default class ChatController {

    /**
     * Add message to chat history
     * @param {number} roomId - Room ID
     * @param {string} message - Message data
     * @param {number} userId - User ID
     * @param {string} type - Message type
     */
    public async addMessage(roomId: number, message: string, userId: number, type: string, nickname: string): Promise<void> {
        try {
            const messageData = {
                message: message,
                date: new Date(),
                userId: userId,
                type: type,
                nickname: nickname,
                roomId: roomId
            };
            
            await ChatHistory.create(messageData);
        } catch (error: any) {
            console.log(error);
            throw new CustomError(`Error saving message: ${error.messsage}`, 500);
        }
    }

    /**
     * Get message history from specific room
     * @param {number} roomId - Room ID
     * @return {Array<MessageDocument>} - Message history
     */
    public async getMessageHistory(roomId: number): Promise<Array<MessageDocument>> {
        try {
            const chatHistory = await ChatHistory.findAll({
                'where': {
                    'roomId': roomId
                }
            });
            
            return chatHistory;
        } catch (error: any) {
            console.log(error);
            throw new CustomError(`Error getting message history: ${error.messsage}`, 500);
        }
    }
}