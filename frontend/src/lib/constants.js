// Application Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Patient Management System';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || 'Professional Patient Management Dashboard';

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;

// Environment
export const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development';
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// Feature Flags
export const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
export const ENABLE_DEBUG = import.meta.env.VITE_ENABLE_DEBUG === 'true';

// Storage Keys
export const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'token';
export const USER_KEY = import.meta.env.VITE_USER_KEY || 'user';

// Pagination
export const DEFAULT_PAGE_SIZE = parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 10;
export const MAX_PAGE_SIZE = parseInt(import.meta.env.VITE_MAX_PAGE_SIZE) || 100;

// Session Configuration
export const SESSION_TIMEOUT = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000; // 1 hour

// Date Format
export const DATE_FORMAT = import.meta.env.VITE_DATE_FORMAT || 'MM/DD/YYYY';
export const TIME_FORMAT = import.meta.env.VITE_TIME_FORMAT || 'HH:mm:ss';
