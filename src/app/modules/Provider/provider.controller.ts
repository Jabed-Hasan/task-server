import { Request, Response } from 'express';
import { ProviderService } from './provider.service';

const createProvider = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const result = await ProviderService.createProvider(email);

    res.status(201).json({
      success: true,
      message: 'Provider created successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err?.message || 'Failed to create provider',
    });
  }
};

const getAllProviders = async (req: Request, res: Response) => {
  try {
    const result = await ProviderService.getAllProviders();

    res.status(200).json({
      success: true,
      message: 'Providers retrieved successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err?.message || 'Failed to get providers',
    });
  }
};

const getProviderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ProviderService.getProviderById(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Provider retrieved successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err?.message || 'Failed to get provider',
    });
  }
};

const updateProvider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ProviderService.updateProvider(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Provider updated successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err?.message || 'Failed to update provider',
    });
  }
};

const deleteProvider = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await ProviderService.deleteProvider(id);

    res.status(200).json({
      success: true,
      message: 'Provider deleted successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err?.message || 'Failed to delete provider',
    });
  }
};

export const ProviderController = {
  createProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
  deleteProvider,
};
