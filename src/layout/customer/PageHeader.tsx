import React from 'react';
import { useAuthStore } from '../../store/authStore';

const PageHeader: React.FC = () => {
  const { user } = useAuthStore();
  return (
    <section className="wrapper image-wrapper bg-yellow">
      <div className="container pt-16 pb-6 text-center">
        <div className="row">
          <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto" data-cues="slideInDown" data-group="page-title" data-disabled="true">
            <h1 className="display-1 mb-1" data-cue="slideInDown" data-group="page-title" data-show="true" style={{animationName: 'slideInDown', animationDuration: '700ms', animationTimingFunction: 'ease', animationDelay: '0ms', animationDirection: 'normal', animationFillMode: 'both'}}>
              {user?.name || 'Welcome'}
            </h1>
            <h4 className="mb-0" data-cue="slideInDown" data-group="page-title" data-show="true" style={{animationName: 'slideInDown', animationDuration: '700ms', animationTimingFunction: 'ease', animationDelay: '300ms', animationDirection: 'normal', animationFillMode: 'both'}}>
              Customer Account
            </h4>
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

export default PageHeader; 