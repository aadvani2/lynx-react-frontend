import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CheckmarkIcon from "../../../assets/Icon/checkmark.svg";

interface BookingHeaderProps {
  currentStep?: "selection" | "address" | "confirm";
  showServiceAddress?: boolean; // when false, hide the middle step (for /returning-user)
}

export default function BookingHeader({ currentStep = "address", showServiceAddress = true }: BookingHeaderProps) {
  // Refs for measuring progress bar position
  const step2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progressWidth, setProgressWidth] = useState<string>(showServiceAddress ? "50%" : "50%");
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1440);

  // Calculate progress bar width to end at center of "Service Address"
  useEffect(() => {
    const calculateProgress = () => {
      setViewportWidth(window.innerWidth);
      
      if (currentStep === 'confirm') {
        setProgressWidth('100%')
        return
      }
      if (!showServiceAddress) {
        // Two-step header: selection -> confirm
        setProgressWidth('50%');
        return;
      }
      // Three-step header: compute center of Service Address
      if (step2Ref.current && containerRef.current) {
        const step2Rect = step2Ref.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const center = step2Rect.left + step2Rect.width / 2 - containerRect.left;
        setProgressWidth(`${center}px`);
        return;
      }
      setProgressWidth('50%');
    };

    calculateProgress();
    // Recalculate on window resize
    window.addEventListener('resize', calculateProgress);
    return () => window.removeEventListener('resize', calculateProgress);
  }, [currentStep, showServiceAddress]);

  // Responsive padding and layout
  const getPadding = () => {
    if (viewportWidth < 480) return '20px 12px 12px 12px';
    if (viewportWidth < 640) return '24px 16px 12px 16px';
    if (viewportWidth < 768) return '28px 20px 14px 20px';
    if (viewportWidth < 1024) return '32px 32px 14px 32px';
    if (viewportWidth < 1200) return '36px 60px 14px 60px';
    return '40px 132px 16px 132px';
  };

  const getGap = () => {
    if (viewportWidth < 640) return 12;
    if (viewportWidth < 768) return 16;
    if (viewportWidth < 1024) return 24;
    return 34;
  };

  const getStepFontSize = () => {
    if (viewportWidth < 480) return 12;
    if (viewportWidth < 640) return 14;
    if (viewportWidth < 768) return 15;
    return 18;
  };

  const getLogoSize = () => {
    if (viewportWidth < 480) return { width: 40, height: 20, gap: 5 };
    if (viewportWidth < 640) return { width: 48, height: 24, gap: 6 };
    return { width: 56, height: 27, gap: 7.879 };
  };

  const logoSize = getLogoSize();

  return (
    <div style={{
      width: '100%',
      background: '#fff',
      boxShadow: '0px 2px 4px rgba(39, 39, 39, 0.10)',
      padding: getPadding(),
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        alignItems: viewportWidth < 640 ? 'center' : 'flex-start',
        gap: getGap(),
        width: '100%',
        maxWidth: 1440,
        margin: '0 auto',
        flexDirection: viewportWidth < 640 ? 'column' : 'row'
      }}>
        {/* Logo */}
        <Link 
          to="/" 
          style={{ 
            minWidth: viewportWidth < 640 ? 'auto' : 120, 
            flexShrink: 0, 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            justifyContent: viewportWidth < 640 ? 'center' : 'flex-start'
          }} 
          aria-label="Lynx home"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: `${logoSize.gap}px`, height: `${logoSize.height}px` }}>
            <svg width={logoSize.width} height={logoSize.height} viewBox="0 0 56 27" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${logoSize.height}px`, width: `${logoSize.width}px`, flexShrink: 0 }}>
              <path d="M55.1329 14.2686C54.9479 10.2662 54.4066 6.26194 52.9851 2.4597L52.6209 0.872358C45.4044 2.28872 39.7594 7.53259 35.7656 13.4545C30.506 11.8613 24.9583 11.8069 19.5625 12.9571C16.9415 8.98781 13.6585 5.47506 9.63155 2.86576C7.54021 1.5038 5.02436 0.612011 2.57473 0L2.14828 1.71169C1.43169 3.64486 0.954616 5.62467 0.627478 7.60448C-0.29357 13.54 -0.141684 19.5027 0.699527 25.4402L5.89868 24.4144C5.71369 23.6081 5.53844 22.6677 5.39044 21.7779C4.53171 16.2931 4.08579 10.5266 5.17235 5.05346C8.53525 7.07212 11.2439 10.0797 13.5144 13.2699C14.8015 15.036 15.9679 17.1091 16.9357 19.0617C18.953 18.5255 21.1281 17.9912 23.2448 17.8455C27.4566 17.5035 31.9353 17.7775 35.9116 19.1822L38.2152 20.0448C39.8898 16.5612 42.0883 13.1689 44.6878 10.3051C46.3021 8.51375 48.0936 6.90115 50.1265 5.64604C51.3727 12.0362 50.6406 18.8091 49.3359 25.1255L54.5351 26.1513C55.1056 22.1723 55.2809 18.269 55.129 14.2666L55.1329 14.2686Z" fill="#1E4D5A"/>
            </svg>
            <svg width={logoSize.width * 1.23} height={logoSize.height} viewBox="0 0 69 33" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ height: `${logoSize.height}px`, width: `${logoSize.width * 1.23}px`, flexShrink: 0 }}>
              <path d="M28.0383 7.57727L21.5306 26.1882C19.7547 31.2339 17.6692 32.9883 14.6607 32.9883C12.141 32.9883 9.85684 31.2883 9.45765 28.1952L12.2305 26.2776C12.4662 27.3812 13.4807 27.9971 14.6588 27.9971C16.0725 27.9971 16.7793 27.2918 17.5056 25.1041H14.8223L8.69434 7.57727H14.4582C16.6157 13.7265 17.5952 17.9776 18.2651 21.9022H18.5377C19.3536 17.8144 20.4401 13.3107 22.5081 7.57727H28.0363H28.0383Z" fill="#1E4D5A"/>
              <path d="M42.2671 26.1532V16.7671C42.2671 14.3074 41.2702 13.0057 39.0951 13.0057C36.6669 13.0057 34.9981 14.9952 34.9981 18.0164V26.1552H29.5049V7.57921H35.0876L34.2542 15.5373H34.4528C35.6134 9.56873 38.0786 7.00023 41.975 7.00023C46.4167 7.00023 47.7584 10.309 47.7584 14.8495V26.1532H42.2652H42.2671Z" fill="#1E4D5A"/>
              <path d="M62.3743 26.1532C60.1622 21.4514 59.5469 20.2566 59.3288 18.5565H59.1652C58.9666 20.1303 58.6395 20.7093 56.0652 26.1532H49.5205L55.7926 16.6758L49.9002 7.57921H56.5345C58.583 12.6618 58.9627 13.439 59.1457 14.8689H59.3269C59.4534 13.5847 59.7066 12.9688 61.8836 7.57921H68.5178L62.6625 16.3883L68.9346 26.1552H62.3723L62.3743 26.1532Z" fill="#1E4D5A"/>
              <path d="M5.49318 20.0739V0H0V19.9205C0 23.3633 2.79625 26.1532 6.24677 26.1532H8.21544V21.2339H6.65374C6.01115 21.2339 5.49124 20.7151 5.49124 20.0739H5.49318Z" fill="#1E4D5A"/>
            </svg>
          </div>
        </Link>
        
        {/* Steps and Progress */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: viewportWidth < 640 ? 6 : 9, minWidth: 0, width: '100%' }}>
          <div
            ref={containerRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              flexWrap: 'nowrap',
              gap: viewportWidth < 480 ? 20 : viewportWidth < 640 ? 32 : viewportWidth < 768 ? 12 : 0
            }}
          >
            {/* Step 1: Service Selection - tick only */}
            <div style={{ display: 'flex', alignItems: 'center', gap: viewportWidth < 640 ? 4 : 6, flexShrink: 0 }}>
              <span style={{ width: viewportWidth < 640 ? 14 : 16, height: viewportWidth < 640 ? 14 : 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={CheckmarkIcon} alt="checked" style={{ width: viewportWidth < 640 ? 14 : 16, height: viewportWidth < 640 ? 14 : 16 }} />
              </span>
              <span style={{
                color: '#1E4D5A',
                fontSize: getStepFontSize(),
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 700,
                lineHeight: viewportWidth < 640 ? '18px' : '22px',
                whiteSpace: viewportWidth < 480 ? 'normal' : 'nowrap'
              }}>Service Selection</span>
            </div>
            
            {/* Step 2: Service Address (hidden for pages that do not show it) */}
            {showServiceAddress && (
              <div ref={step2Ref} style={{ display: 'flex', alignItems: 'center', gap: viewportWidth < 640 ? 4 : 6, flexShrink: 0 }}>
                <span style={{ width: viewportWidth < 640 ? 14 : 16, height: viewportWidth < 640 ? 14 : 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {currentStep === 'confirm' && (
                    <img src={CheckmarkIcon} alt="checked" style={{ width: viewportWidth < 640 ? 14 : 16, height: viewportWidth < 640 ? 14 : 16 }} />
                  )}
                </span>
                <span style={{
                  color: '#1E4D5A',
                  fontSize: getStepFontSize(),
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  fontWeight: 700,
                  lineHeight: viewportWidth < 640 ? '18px' : '22px',
                  whiteSpace: viewportWidth < 480 ? 'normal' : 'nowrap'
                }}>Service Address</span>
              </div>
            )}

            {/* Step 3: Confirm Booking - label only */}
            <div style={{ display: 'flex', alignItems: 'center', gap: viewportWidth < 640 ? 4 : 6, flexShrink: 0 }}>
              <span style={{
                color: '#1E4D5A',
                fontSize: getStepFontSize(),
                fontFamily: 'Bricolage Grotesque, sans-serif',
                fontWeight: 700,
                lineHeight: viewportWidth < 640 ? '18px' : '22px',
                whiteSpace: viewportWidth < 480 ? 'normal' : 'nowrap'
              }}>Confirm Booking</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: viewportWidth < 640 ? 6 : 8,
            background: '#C8E9EF',
            borderRadius: 16,
            marginTop: viewportWidth < 640 ? 6 : 8
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: viewportWidth < 640 ? 6 : 8,
              width: progressWidth,
              background: '#1E4D5A',
              borderRadius: 16,
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}


