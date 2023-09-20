import ChatHistory, { MessageDocument } from "../models/ChatHistory";

export default class ChatController {

    /**
     * Add message to chat history
     * @param {string} roomId - Room ID
     * @param {string} message - Message data
     * @param {string} userId - User ID
     * @param {string} type - Message type
     */
    public async addMessage(roomId: string, message: string, userId: string, type: string, nickname: string): Promise<void> {
        try {
            const messageData = {
                data: message,
                date: new Date(),
                userId: userId,
                type: type,
                nickname: nickname
            };
            
            await ChatHistory.findOneAndUpdate(
                { 'roomId': roomId },
                {
                    '$push': {
                        'messages': messageData
                    }
                },
                {
                    'upsert': true
                }
            );    
        } catch (error: any) {
            console.log(error);
            throw Error(`Error saving message: ${error.messsage}`);
        }
    }

    /**
     * Get message history from specific room
     * @param {string} roomId - Room ID
     * @return {Array<MessageDocument>} - Message history
     */
    public async getMessageHistory(roomId: string): Promise<Array<MessageDocument>> {
        try {
            const chatHistory = await ChatHistory.findOne({
                'roomId': roomId
            });
            
            return chatHistory?.messages?? [];
        } catch (error: any) {
            console.log(error);
            throw Error(`Error getting message history: ${error.messsage}`);
        }
    }
}