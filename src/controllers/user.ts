import User from '../models/User';
import bcrypt from 'bcrypt';
import CustomError from './customError';
import jwt from 'jsonwebtoken';

interface LoginResponse {
    token: string,
    userId: number
};

export default class UserController {
    /**
     * Add new user
     * @param {string} nickname - Nickname
     * @param {string} userId - Socket ID
     * @returns {string} - User ID
     */
    public async addUser(nickname: string, password: string): Promise<void> {
        try {
            const encryptedPassword = await this.encryptPassword(password);

            const userData = {
                nickname: nickname,
                active: true,
                password: encryptedPassword
            };
    
            await User.create(userData);
        } catch (error: any) {
            console.error(error);
            throw new CustomError(`Error saving new user: ${error.messsage}`, 500);
        }
    }

    /**
     * Update user status
     * @param {string} userId - User ID
     * @param {boolean} status - New user status
     */
    public async updateStatus(userId: number, status: boolean): Promise<void> {
        try {
            await User.update({'active': status },
                {
                    'where': {
                        'id' : userId
                    }
                });
        } catch (error: any) {
            console.error(error);
            throw new CustomError(`Error updating status: ${error.messsage}`, 500);
        }
    }

    /**
     * Delete user data and remove from all joined rooms
     * @param {string} userId - User ID
     */
    public async removeUser(userId: string): Promise<void> {
        try {
            await User.destroy({ 
                'where': {
                    'id': userId
                }
            }
        );
        } catch (error: any) {
            console.error(error);
            throw new CustomError(`Error deleting user: ${error.messsage}`, 500);
        }
    }

    /**
     * Check if user exists
     * @param {string} nickname - Nickname 
     * @returns {boolean} True if user exists, false otherwise
     */
    public async userExist(nickname: string): Promise<boolean> {
        try {
            const exists = await User.count({
                'where': {
                    'nickname': nickname
                }
            });

            return exists > 0;
        } catch (error: any) {
            console.error(error);
            throw new CustomError(`Error checking user: ${error.messsage}`, 500);
        }
    }

    /**
     * Login user
     * @param {string} nickname - Nickname
     * @param {string} password = Password
     * @returns {string | undefined} - JWT token
     */
    public async login(nickname: string, password: string): Promise<LoginResponse> {
        try {
            const user = await User.findOne({
                'where': {
                    'nickname': nickname
                }
            });

            if(!user) {
                throw new CustomError('User not found', 404);
            }

            const isValidPassword = await this.validatePassword(password, user.password);

            if(!isValidPassword) {
                throw new CustomError('Invalid password', 401);
            }
            
            const token = this.getToken(user);
    
            return {token: token, userId: user.id};
        } catch (error: any) {
            console.error(error);
            if(error instanceof CustomError) {
                throw new CustomError(error.message, error.code);
            } else {
                throw new CustomError(`Error login: ${error.messsage}`, 500);
            }
        }
    }

    /**
     * Encrypt password
     * @param {string} password - Password
     * @returns - Password hash
     */
    private async encryptPassword(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(7);
            const hash = await bcrypt.hash(password, salt);

            return hash;
        } catch (error: any) {
            throw Error(`Encrypted error: ${error.message}`);
        }
    }

    /**
     * Check is password is valid
     * @param {string} password - Password
     * @param {string} passwordHash = Password hash
     * @returns True if password is valid or false otherwise
     */
    private async validatePassword(password: string, passwordHash: string): Promise<boolean> {
        const isValid = await bcrypt.compare(password, passwordHash);
        return isValid;
    }

    /**
     * Generate JWT
     * @param {User} user - User info
     * @returns {string} = JWT token
     */
    private getToken(user: User) : string {
        const token = jwt.sign({
            id: user.id,
            nickname: user.nickname
        },
        process.env.JWT_SECRET as string,
        {
            algorithm: 'HS256',
            expiresIn: '12h'
        });

        return token;
    }
}