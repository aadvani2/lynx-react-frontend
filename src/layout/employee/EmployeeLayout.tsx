import React from 'react';
import SideMenu from './SideMenu';
import PageHeader from './PageHeader';

interface EmployeeLayoutProps {
  children?: React.ReactNode;
  setActivePage: (page: string) => void;
  activePage: string;
}

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({ children, setActivePage, activePage }) => {
  return (
    <div>
      <PageHeader />
      <section className="wrapper employee-wrapper">
        <div className="container pt-6 pb-10">
          <div className="row employee-row">
            <SideMenu setActivePage={setActivePage} activePage={activePage} />
            <div className="col lynx-my_account my-account-employee position-relative overflow-hidden" id="loadView1">
              <div className="loader-main-v2 d-none">
                <span className="loader-v2"> </span>
              </div>
              <div id="loadView">
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmployeeLayout; 