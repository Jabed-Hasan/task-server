import { Request, response, Response } from "express";
import { userService } from "./user.service";





const CreateAdmin = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    
    const result = await userService.CreateAdmin(email);
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err?.message || "Failed to create admin",
      error: err?.message,
    });
  }
};

const getUSerfromDB = async(req: Request, res: Response) => {
  try{
    const result = await userService.getUserfromDB(); 
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  }catch(err: any){
    res.status(500).json({
      success: false, 
      message: err?.name || "Failed to fetch users",
      error: err.message,
    });
  }

};

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err?.message || "Failed to create user",
      error: err?.message,
    });
  }
};

export const UserController = {
    CreateAdmin,
    getUSerfromDB,
    createUser
}

    