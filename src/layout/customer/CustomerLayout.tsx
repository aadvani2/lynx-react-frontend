import React, { Suspense, lazy } from 'react';
import LoadingComponent from '../../components/common/LoadingComponent';

/* --- Lazy Load All Layout Components --- */
const SideMenu = lazy(() => import('./SideMenu'));
const PageHeader = lazy(() => import('./PageHeader'));
const ChatWidget = lazy(() => import('../../components/common/ChatWidget'));

interface CustomerLayoutProps {
  children?: React.ReactNode;
  setActivePage: (page: string) => void;
  activePage: string;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  children,
  setActivePage,
  activePage
}) => {
  return (
    <div>

      {/* PAGE HEADER */}
      <Suspense fallback={<LoadingComponent />}>
        <PageHeader />
      </Suspense>

      <section className="wrapper customer-wrapper">
        <div className="container pt-6 pb-10">
          <div className="row customer-row">

            {/* SIDE MENU */}
            <Suspense fallback={<LoadingComponent />}>
              <SideMenu setActivePage={setActivePage} activePage={activePage} />
            </Suspense>

            {/* PAGE CONTENT */}
            <div className="col lynx-my_account my-account-customer position-relative overflow-hidden" id="loadView1">
              <div id="loadView">

                <Suspense fallback={<LoadingComponent />}>
                  {children}
                </Suspense>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CHAT WIDGET */}
      <Suspense fallback={<></>}>
        <ChatWidget />
      </Suspense>

    </div>
  );
};

export default CustomerLayout;
