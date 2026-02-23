import { useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import Header from "./Header/Header";

// Header is above the fold and needed immediately - don't lazy load
// Footer is below the fold - can be lazy loaded for better performance
const Footer = lazy(() => import("./Footer/Footer"));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  // Hide site header/footer on booking flow pages that render their own headers
  const path = location.pathname;
  const shouldHideHeader =
    path === "/booking" ||
    path === "/confirm-booking" ||
    path.startsWith("/booking/confirmed") ||
    path.startsWith("/returning-user");
  
  return (
    <>
      {!shouldHideHeader && <Header />}
      {children}
      {!shouldHideHeader && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </>
  );
};

export default Layout;
