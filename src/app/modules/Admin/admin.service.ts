import { Admin } from '../../../entities/Admin.entity';
import { User, UserStatus } from '../../../entities/User.entity';
import { adminSearchableFields } from './admin.constant';
import { paginationHelper } from '../../../helper/paginationHelper';
import AppDataSource from '../../../config/database';
import { IAdminFilterRequest } from './admin.interface';
import { IPaginationOptions } from '../../interfaces/pagination';
import { ILike } from 'typeorm';

const getAllAdminsfromDB = async (params: IAdminFilterRequest, options: IPaginationOptions)=> {
    const {limit, page, sortBy, sortOrder, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData} = params;
    
    const adminRepository = AppDataSource.getRepository(Admin);
    
    // Base condition - always filter non-deleted admins
    const baseCondition: any = { isDeleted: false };
    
    // Add filter data to base condition
    if(Object.keys(filterData).length > 0){
        Object.keys(filterData).forEach((key) => {
            baseCondition[key] = (filterData as any)[key];
        });
    }
    
    // Build where clause for search
    let finalWhere: any;
    if(searchTerm){
        // For search, create OR conditions across searchable fields
        const searchConditions = adminSearchableFields.map((field) => ({
            ...baseCondition,
            [field]: ILike(`%${searchTerm}%`)
        }));
        finalWhere = searchConditions;
    } else {
        finalWhere = baseCondition;
    }

    const [result, total] = await adminRepository.findAndCount({
        where: finalWhere,
        skip,
        take: limit,
        order: options.sortBy && options.sortOrder 
            ? { [options.sortBy]: options.sortOrder.toUpperCase() } 
            : { createdAt: 'DESC' },
    });

    return {
        meta:{
             page,
             limit,
             total,
        },
        data: result
    };
}

const getByIdFromDB = async(id: string) :Promise<Admin | null>  => {
   const adminRepository = AppDataSource.getRepository(Admin);
   const result = await adminRepository.findOne({
        where: {
            id,
            isDeleted: false,
        },
   });
    return result;
}

const updateIntoDB = async(id: string, data: Partial<Admin>):Promise<Admin | null> => {
   const adminRepository = AppDataSource.getRepository(Admin);
   
   const admin = await adminRepository.findOne({
        where: {
            id,
            isDeleted: false,
        },
   });

   if(!admin) {
       throw new Error('Admin not found');
   }

   Object.assign(admin, data);
   const result = await adminRepository.save(admin);
   return result;
}

const DeleteFromDB = async(id: string):Promise<Admin | null>   => {
    const adminRepository = AppDataSource.getRepository(Admin);
    const userRepository = AppDataSource.getRepository(User);

    const admin = await adminRepository.findOne({
        where: { id },
    });

    if(!admin) {
        throw new Error('Admin not found');
    }

    const result = await AppDataSource.transaction(async(transactionalEntityManager)=>{
        const admindeletedData = await transactionalEntityManager.remove(Admin, admin);

        const user = await transactionalEntityManager.findOne(User, {
            where: { email: admin.email },
        });

        if(user) {
            await transactionalEntityManager.remove(User, user);
        }

        return admindeletedData;
    });
    return result;
}

const SoftDeleteFromDB = async(id: string):Promise<Admin | null> => {
    const adminRepository = AppDataSource.getRepository(Admin);

    const admin = await adminRepository.findOne({
        where: {
            id,
            isDeleted: false,
        },
    });

    if(!admin) {
        throw new Error('Admin not found');
    }

    const result = await AppDataSource.transaction(async(transactionalEntityManager)=>{
        admin.isDeleted = true;
        const admindeletedData = await transactionalEntityManager.save(Admin, admin);

        const user = await transactionalEntityManager.findOne(User, {
            where: { email: admin.email },
        });

        if(user) {
            user.status = UserStatus.DELETED;
            await transactionalEntityManager.save(User, user);
        }

        return admindeletedData;
    });
    return result;
}

export const AdminService = {
    getAllAdminsfromDB,
    getByIdFromDB,
    updateIntoDB,
    DeleteFromDB,
    SoftDeleteFromDB,
}
