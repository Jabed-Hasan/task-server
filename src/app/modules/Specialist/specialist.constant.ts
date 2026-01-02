export const specialistFilterableFields = [
  'searchTerm',
  'title',
  'is_draft',
  'is_verified',
  'verification_status',
  'min_price',
  'max_price',
];

export const specialistSearchableFields = [
  'title',
  'description',
  'slug',
];

export const SPECIALIST_STATUS = {
  DRAFT: true,
  PUBLISHED: false,
} as const;

export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export const SERVICE_CATEGORIES = [
  'Incorporation of a new company',
  'Monthly Company Secretarial subscription',
  'Opening of Bank Account',
  'Appointment of Secretary',
  'Appointment/Resignation of Director',
  'Change of Nature of Business',
] as const;

export const SUPPORTED_COMPANY_TYPES = [
  {
    name: 'Private Limited - Sdn. Bhd.',
    description: 'Most common choice for businesses in Malaysia. Offers limited liability, easy ownership, and is ideal for startups and SMEs.',
  },
  {
    name: 'Public Limited - Bhd.',
    description: 'Suitable for large businesses planning to raise capital from the public or list on the stock exchange',
  },
] as const;

export const ADDITIONAL_OFFERINGS = [
  {
    name: 'Company Secretary Subscription',
    description: 'Enjoy 1 month free Company Secretary Subscription',
  },
  {
    name: 'Opening of a Bank Account',
    description: 'Complimentary Corporate Bank Account Opening',
  },
  {
    name: 'Access Company Records and SSM Forms',
    description: '24/7 Secure Access to Statutory Company Records',
  },
  {
    name: 'Priority Filing',
    description: 'Documents are prioritized for submission and swift processing - within 24 hours',
  },
  {
    name: 'Registered Office Address Use',
    description: 'Use of SSM Compliant Registered Office Address with Optional Mail Forwarding',
  },
  {
    name: 'Compliance Calendar Setup',
    description: 'Get automated reminders for all statutory deadlines',
  },
  {
    name: 'First Share Certificate Issued Free',
    description: "Receive your company's first official share certificate at no cost",
  },
  {
    name: 'CTC Delivery & Courier Handling',
    description: 'Have your company documents and certified copies delivered securely to you',
  },
  {
    name: 'Chat Support',
    description: 'Always-On Chat Support for Compliance, Filing, and General Queries',
  },
] as const;
