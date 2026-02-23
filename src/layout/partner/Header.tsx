import { useAuthStore } from '../../store/authStore';

const Header = () => {
  const { user } = useAuthStore();

  // Get user display name - fallback to email if name is not available
  const getUserDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split('@')[0]; // Use part before @ as display name
    }
    return 'Partner';
  };

  // Get user status
  const getUserStatus = () => {
    if (user?.is_verified) {
      return 'Verified Partner';
    }
    return 'Partner Account';
  };

  return (
    <section className="wrapper image-wrapper bg-yellow">
      <div className="container pt-16 pb-6 text-center">
        <div className="row">
          <div
            className="col-lg-10 col-xl-10 col-xxl-10 mx-auto"
            style={{ animation: 'fadeIn 0.5s ease' }}
          >
            <h1 className="display-1 mb-1" style={{ visibility: 'visible' }}>{getUserDisplayName()}</h1>
            <h4 className="mb-0" style={{ visibility: 'visible' }}>{getUserStatus()}</h4>
          </div>
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="divider text-light mx-n2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60">
            <path fill="currentColor" d="M0,0V60H1440V0A5771,5771,0,0,1,0,0Z" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Header; 