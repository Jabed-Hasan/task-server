type Ioptions = {
    page?: number | string;
    limit?: number | string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

const calculatePagination = (options:Ioptions) : IOptionsResult => {
    const page: number =  Number(options.page || 1);
    const limit: number = Number(options.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy: string = options.sortBy || 'createdAt';
    const sortOrder: 'asc' | 'desc' = options.sortOrder || 'desc';
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };  
}

export const paginationHelper = {
    calculatePagination,
};