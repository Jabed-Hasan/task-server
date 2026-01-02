import { VerificationStatus } from '../../../entities/Specialist.entity';

export interface ISpecialistFilters {
  searchTerm?: string;
  title?: string;
  is_draft?: boolean;
  is_verified?: boolean;
  verification_status?: VerificationStatus;
  min_price?: number;
  max_price?: number;
}

export interface ISupportedCompanyType {
  name: string;
  description: string;
}

export interface IAdditionalOffering {
  name: string;
  description: string;
}

export interface IServiceOffering {
  name: string;
}

export interface IMediaInput {
  file_name: string;
  file_url?: string;
  cloudinary_public_id?: string;
  file_size: number;
  mime_type: string;
  media_type: string;
  display_order?: number;
}

export interface ICreateSpecialistInput {
  title: string;
  description?: string;
  base_price: number;
  duration_days?: number;
  is_draft?: boolean;
  service_category?: string;
  supported_company_types?: ISupportedCompanyType[];
  additional_offerings?: IAdditionalOffering[];
  service_offerings_data?: IServiceOffering[];
  media?: IMediaInput[];
}

export interface IUpdateSpecialistInput {
  title?: string;
  description?: string;
  base_price?: number;
  duration_days?: number;
  is_draft?: boolean;
  is_verified?: boolean;
  verification_status?: VerificationStatus;
  service_category?: string;
  supported_company_types?: ISupportedCompanyType[];
  additional_offerings?: IAdditionalOffering[];
  service_offerings_data?: IServiceOffering[];
  media?: IMediaInput[];
}
