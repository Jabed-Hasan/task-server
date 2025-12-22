import { UserRole } from "../../../entities/User.entity";
import bcrypt from 'bcrypt';    
import AppDataSource from "../../../config/database";
import { User } from "../../../entities/User.entity";
import { Admin } from "../../../entities/Admin.entity";
import crypto from 'crypto';

// Helper function to generate UUID
const generateUUID = () => {
    return crypto.randomUUID();
};

const CreateAdmin = async (data: any) => {
    const hashedpassword: string = await bcrypt.hash(data.password, 10);
    const now = new Date();
    const userData = { 
        id: generateUUID(), // Generate UUID manually
        email: data.admin.email,
        password: hashedpassword,
        role: UserRole.ADMIN,
        createdAt: now,
        updatedAt: now,
    };

    // Use TypeORM transaction
    const result = await AppDataSource.transaction(async (transactionalEntityManager) => {
        // 1️⃣ Create user first
        const user = transactionalEntityManager.create(User, userData);
        const createdUser = await transactionalEntityManager.save(user);

        // 2️⃣ Create admin linked to the user (linked by email)
        const adminData = {
            ...data.admin,
            id: generateUUID(), // Generate UUID manually
            createdAt: now,
            updatedAt: now,
        };
        const admin = transactionalEntityManager.create(Admin, adminData);
        const createdAdmin = await transactionalEntityManager.save(admin);

        return createdAdmin;
    });

    return result;
};


const getUserfromDB = async() => {
    const userRepository = AppDataSource.getRepository(User);
    const result = await userRepository.find();
    return result;
}

export const userService = {
  CreateAdmin,
  getUserfromDB,
  
};
