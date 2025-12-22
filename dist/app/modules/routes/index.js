"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../User/user.routes");
const admin_routes_1 = require("../Admin/admin.routes");
const auth_route_1 = require("../Auth/auth.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/users',
        route: user_routes_1.UserRouter,
    },
    {
        path: '/admin',
        route: admin_routes_1.AdminRouters
    },
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    }
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
//# sourceMappingURL=index.js.map