import express from "express";
import { UserRouter } from "../User/user.routes";
import { AdminRouters } from "../Admin/admin.routes";
import path from "path";
import { AuthRoutes } from "../Auth/auth.route";
import { SpecialistRoutes } from "../Specialist/specialist.routes";
import { ProviderRoutes } from "../Provider/provider.routes";
const router = express.Router();

const moduleRoutes = [
    {  
        path: '/users',
        route: UserRouter,
    },
    {
        path: '/admin',
        route: AdminRouters
        
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/specialists',
        route: SpecialistRoutes,
    },
    {
        path: '/providers',
        route: ProviderRoutes,
    }
];


moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;