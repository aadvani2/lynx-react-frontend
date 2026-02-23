import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredAuth?: boolean;
  allowedUserTypes?: ('customer' | 'provider' | 'employee')[];
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredAuth = true,
  allowedUserTypes = [],
  redirectTo = '/sign-in'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  
  const { user, isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    const validateAuth = () => {
      // Special case: Allow access to verify-account page if user has token but no user data (unverified)
      if (location.pathname === '/verify-account') {
        if (token) {
          setIsChecking(false);
          return;
        } else {
          // No token for verify page, redirect to login
          navigate('/sign-in', { replace: true });
          return;
        }
      }
      
      // For other routes, check if user is authenticated
      if (requiredAuth && !isAuthenticated) {
        // User is not authenticated, redirect to login
        navigate(redirectTo, { 
          replace: true,
          state: { from: location.pathname }
        });
        return;
      }

      if (requiredAuth && isAuthenticated && allowedUserTypes.length > 0) {
        // Check if user type is allowed
        if (!user || !allowedUserTypes.includes(user.user_type)) {
          // User type not allowed, redirect to appropriate page
          const userTypeRedirects: Record<string, string> = {
            customer: '/my-account',
            provider: '/professional/my-account',
            employee: '/employee/my-account'
          };
          
          const redirectPath = userTypeRedirects[user?.user_type || 'customer'] || '/sign-in';
          navigate(redirectPath, { replace: true });
          return;
        }
      }

      if (!requiredAuth && isAuthenticated) {
        // User is authenticated but this route doesn't require auth
        // Redirect to appropriate dashboard based on user type
        const userTypeRedirects: Record<string, string> = {
          customer: '/my-account',
          provider: '/professional/my-account',
          employee: '/employee/my-account'
        };
        
        const redirectPath = userTypeRedirects[user?.user_type || 'customer'] || '/sign-in';
        navigate(redirectPath, { replace: true });
        return;
      }

      setIsChecking(false);
    };

    validateAuth();
  }, [requiredAuth, allowedUserTypes, redirectTo, navigate, location, user, isAuthenticated, token]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard; 