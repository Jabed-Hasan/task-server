import AppDataSource from '../../../config/database';
import { Provider } from '../../../entities/Provider.entity';
import { User, UserRole } from '../../../entities/User.entity';

const createProvider = async (email: string): Promise<any> => {
  const userRepository = AppDataSource.getRepository(User);
  const providerRepository = AppDataSource.getRepository(Provider);

  // Check if user exists
  const existingUser = await userRepository.findOne({
    where: { email },
  });

  if (!existingUser) {
    throw new Error('No user found with this email. Please create a user first.');
  }

  // Check if already a provider
  if (existingUser.role === UserRole.PROVIDER) {
    throw new Error('This user is already assigned as a provider');
  }

  // Check if provider profile already exists
  const existingProvider = await providerRepository.findOne({
    where: { email },
  });

  if (existingProvider) {
    throw new Error('Provider profile already exists for this email');
  }

  // Update user role to PROVIDER
  existingUser.role = UserRole.PROVIDER;
  await userRepository.save(existingUser);

  // Create provider profile
  const newProvider = providerRepository.create({
    name: existingUser.name || 'Provider',
    email: existingUser.email,
    contactNumber: existingUser.phoneNumber || null,
  });

  const result = await providerRepository.save(newProvider);
  return result;
};

const getAllProviders = async (): Promise<Provider[]> => {
  const providerRepository = AppDataSource.getRepository(Provider);
  return await providerRepository.find({
    where: { isDeleted: false },
  });
};

const getProviderById = async (id: string): Promise<Provider | null> => {
  const providerRepository = AppDataSource.getRepository(Provider);
  return await providerRepository.findOne({
    where: { id, isDeleted: false },
  });
};

const getProviderByEmail = async (email: string): Promise<Provider | null> => {
  const providerRepository = AppDataSource.getRepository(Provider);
  return await providerRepository.findOne({
    where: { email, isDeleted: false },
  });
};

const updateProvider = async (
  id: string,
  payload: Partial<Provider>
): Promise<Provider | null> => {
  const providerRepository = AppDataSource.getRepository(Provider);

  const provider = await providerRepository.findOne({
    where: { id, isDeleted: false },
  });

  if (!provider) {
    throw new Error('Provider not found');
  }

  Object.assign(provider, payload);
  return await providerRepository.save(provider);
};

const deleteProvider = async (id: string): Promise<Provider | null> => {
  const providerRepository = AppDataSource.getRepository(Provider);
  const userRepository = AppDataSource.getRepository(User);

  const provider = await providerRepository.findOne({
    where: { id, isDeleted: false },
  });

  if (!provider) {
    throw new Error('Provider not found');
  }

  // Soft delete provider
  provider.isDeleted = true;
  await providerRepository.save(provider);

  // Revert user role back to USER
  const user = await userRepository.findOne({
    where: { email: provider.email },
  });

  if (user) {
    user.role = UserRole.USER;
    await userRepository.save(user);
  }

  return provider;
};

export const ProviderService = {
  createProvider,
  getAllProviders,
  getProviderById,
  getProviderByEmail,
  updateProvider,
  deleteProvider,
};
