import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User as ApiUser } from '../types/user';
import { authService } from '../services/generalServices/authService';

// Extended User interface for auth store
export interface User extends Omit<ApiUser, 'user_type'> {
  user_type: 'customer' | 'provider' | 'employee';
  is_verified?: boolean;
}

// Auth store state
interface AuthState {
  user: User | null;
  token: string | null;
  verificationToken: string | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  isLoading: boolean;
}

// Auth store actions
interface AuthActions {
  // Authentication
  login: (user: User, token: string, isVerified?: boolean) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  
  // Token management
  setToken: (token: string) => void;
  getToken: () => string | null;
  setVerificationToken: (token: string) => void;
  getVerificationToken: () => string | null;
  
  // State management
  setLoading: (loading: boolean) => void;
  checkAuth: () => boolean;
  
  // Verification
  setVerificationStatus: (isVerified: boolean) => void;
  setUnverifiedUser: (user: User, verificationToken: string) => void;
  completeVerification: (user: User, authToken: string) => void;
  
  // User image
  updateUserImage: (imageUrl: string | null) => void;
}

export type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      verificationToken: null,
      isAuthenticated: false,
      isVerified: false,
      isLoading: false,

      // Authentication
      login: (user: User, token: string, isVerified?: boolean) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isVerified: isVerified !== undefined ? isVerified : true, // Default to true for backwards compatibility
          isLoading: false
        });
      },

      logout: async () => {
        const { user } = get();
        
        // Call logout API if user is authenticated
        if (user && user.user_type) {
          try {
            await authService.logout(user.user_type);
          } catch (error) {
            // Log error but continue with local logout even if API call fails
            console.error('Logout API error:', error);
          }
        }
        
        // Clear local state regardless of API call result
        set({
          user: null,
          token: null,
          verificationToken: null,
          isAuthenticated: false,
          isVerified: false,
          isLoading: false
        });
        
        // Clear localStorage and sessionStorage
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('authToken');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refreshToken');
        sessionStorage.clear();
      },

      updateUser: (user: User) => {
        set((state) => ({
          user: { ...state.user, ...user }
        }));
      },

      // Token management
      setToken: (token: string) => {
        set({ token });
      },

      getToken: () => {
        return get().token;
      },

      setVerificationToken: (verificationToken: string) => {
        set({ verificationToken });
      },

      getVerificationToken: () => {
        return get().verificationToken;
      },

      // State management
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkAuth: () => {
        const { token, isAuthenticated, isVerified } = get();
        return !!(token && isAuthenticated && isVerified);
      },

      // Verification
      setVerificationStatus: (isVerified: boolean) => {
        set((state) => ({
          user: state.user ? { ...state.user, is_verified: isVerified } : null,
          isVerified
        }));
      },

      setUnverifiedUser: (user: User, verificationToken: string) => {
        set({
          user: { ...user, is_verified: false },
          verificationToken,
          token: null,
          isAuthenticated: false,
          isVerified: false,
          isLoading: false
        });
      },

      completeVerification: (user: User, authToken: string) => {
        set({
          user: { ...user, is_verified: true },
          token: authToken,
          verificationToken: null,
          isAuthenticated: true,
          isVerified: true,
          isLoading: false
        });
      },
      
      // Update user image
      updateUserImage: (imageUrl: string | null) => {
        set((state) => ({
          user: state.user ? { ...state.user, image: imageUrl } : null
        }));
      }
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        verificationToken: state.verificationToken,
        isAuthenticated: state.isAuthenticated,
        isVerified: state.isVerified
      }), // only persist these fields
    }
  )
); 