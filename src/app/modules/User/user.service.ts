import { UserRole } from "../../../entities/User.entity";
import bcrypt from 'bcrypt';    
import AppDataSource from "../../../config/database";
import { User } from "../../../entities/User.entity";


const CreateAdmin = async (email: string) => {
    const userRepository = AppDataSource.getRepository(User);
    
    // Check if user exists with this email
    const existingUser = await userRepository.findOne({
        where: { email }
    });
    
    if (!existingUser) {
        throw new Error('No user found with this email. Please create a user first.');
    }
    
    // Check if user is already an admin
    if (existingUser.role === UserRole.ADMIN || existingUser.role === UserRole.SUPER_ADMIN) {
        throw new Error('This user is already assigned as an admin');
    }
    
    // Update user role to ADMIN
    existingUser.role = UserRole.ADMIN;
    existingUser.updatedAt = new Date();
    
    const result = await userRepository.save(existingUser);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
};


const getUserfromDB = async() => {
    const userRepository = AppDataSource.getRepository(User);
    const result = await userRepository.find();
    return result;
}

const createUser = async (data: any) => {
    const userRepository = AppDataSource.getRepository(User);
    
    // Check if user already exists
    const existingUser = await userRepository.findOne({
        where: { email: data.email }
    });
    
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    
    const hashedPassword: string = await bcrypt.hash(data.password, 10);
    const now = new Date();
    
    const userData = { 
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phoneNumber: data.phoneNumber,
        role: data.role || UserRole.USER,
        needsPasswordReset: data.needsPasswordReset || false,
        status: data.status || 'ACTIVE',
        createdAt: now,
        updatedAt: now,
    };

    const user = userRepository.create(userData);
    const result = await userRepository.save(user);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = result;
    return userWithoutPassword;
};

export const userService = {
  CreateAdmin,
  getUserfromDB,
  createUser,
};