import Constants from 'expo-constants';

// Application Configuration
export const APP_NAME = Constants.expoConfig?.extra?.APP_NAME || 'Patient Management';
export const APP_VERSION = Constants.expoConfig?.extra?.APP_VERSION || '1.0.0';
export const APP_DESCRIPTION = Constants.expoConfig?.extra?.APP_DESCRIPTION || 'Professional Patient Management Mobile App';

// API Configuration
export const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = parseInt(Constants.expoConfig?.extra?.API_TIMEOUT) || 10000;

// Environment
export const NODE_ENV = Constants.expoConfig?.extra?.NODE_ENV || 'development';
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

// Feature Flags
export const ENABLE_ANALYTICS = Constants.expoConfig?.extra?.ENABLE_ANALYTICS === 'true';
export const ENABLE_DEBUG = Constants.expoConfig?.extra?.ENABLE_DEBUG === 'true';

// Storage Keys
export const TOKEN_KEY = Constants.expoConfig?.extra?.TOKEN_KEY || '@token';
export const USER_KEY = Constants.expoConfig?.extra?.USER_KEY || '@user';

// Pagination
export const DEFAULT_PAGE_SIZE = parseInt(Constants.expoConfig?.extra?.DEFAULT_PAGE_SIZE) || 10;
export const MAX_PAGE_SIZE = parseInt(Constants.expoConfig?.extra?.MAX_PAGE_SIZE) || 100;

// Session Configuration
export const SESSION_TIMEOUT = parseInt(Constants.expoConfig?.extra?.SESSION_TIMEOUT) || 3600000;

// Colors - Matching web design
export const COLORS = {
    primary: {
        purple: '#9333EA',
        pink: '#EC4899',
        blue: '#3B82F6',
        green: '#10B981',
        teal: '#14B8A6',
        cyan: '#06B6D4',
    },
    gradient: {
        purplePink: ['#9333EA', '#EC4899'],
        blueCyan: ['#3B82F6', '#06B6D4'],
        greenTeal: ['#10B981', '#14B8A6'],
        purplePinkBlue: ['#9333EA', '#EC4899', '#3B82F6'],
    },
    slate: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
    },
    white: '#FFFFFF',
    black: '#000000',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
};
