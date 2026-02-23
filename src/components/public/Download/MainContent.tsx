import React from "react";

import CustomerAndroid from "../../../assets/images/lynx-cust-android.avif";
import CustomerIos from "../../../assets/images/lynx-cust-ios.avif";
import ProviderAndroid from "../../../assets/images/lynx-partner-android.avif";
import ProviderIos from "../../../assets/images/lynx-partner-ios.avif";

import Playstore from "../../../assets/images/playstore.webp";
import Appstore from "../../../assets/images/appstore.webp";


const customerAndroidLink = "https://play.google.com/store/apps/details?id=com.connectwithlynx.app";
const customerIosLink = "https://apps.apple.com/app/id/6468980402";
const providerAndroidLink = "https://play.google.com/store/apps/details?id=com.connectwithlynx.provider";
const providerIosLink = "https://apps.apple.com/in/app/lynx-partner/id6742531799";

// // Reusable Coming Soon Badge Component
// const ComingSoonBadge: React.FC = () => (
//   <div className="coming-soon-wrap">
//     <p>Coming Soon</p>
//   </div>
// );

const DownloadMainContent: React.FC = () => (
  <section className="wrapper">
    <div className="container pt-6 pb-10">
      <div className="row">
        <div className="col-xxl-10 mx-auto">
          <div className="row align-items-center mb-8 mb-md-12">

            {/* /column */}
            <div className="col-lg-5 ms-auto order-lg-2">
              <h3 className="section-title post-title ls-sm mb-3 mobile-text-center">For Customers (Coming Soon)</h3>
              <h4 className="mobile-text-center">Help for your home — right in your pocket.</h4>
              <p className="mobile-text-center">The Lynx Customer App makes it easy to request service, chat with your pro, and track every step — all from your phone.</p>
              <div className="mobile-text-center">
                <ul className="icon-list bullet-bg bullet-soft-primary" style={{ display: 'inline-block', textAlign: 'left' }}>
                  <li><i className="uil uil-check" />Same trusted help. Now just a tap away.</li>
                  <li><i className="uil uil-check" />Coming soon to iOS and Android.</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 mt-3 mt-md-0">

              {/*               
                <div className="card-body p-5 text-center p-lg-12 border shadow-lg">
                    <div className="text-center">
                        <h6>Want early access?</h6>
                        <a href="https://www.connectwithlynx.com/signup" className="btn btn-primary rounded-pill btn-sm">Join the waitlist.</a>
                    </div>
                </div>
              */}
              <div className="card-body p-5 text-center border shadow-lg">
                <div className="row">
                  <div className="col-md-6 col-sm-6 text-center">
                    <a target="_blank" href={customerAndroidLink}>
                      <img src={CustomerAndroid} className="h-20 rounded-xl" alt="" />
                    </a>
                    <div className="mt-3">
                      <a href={customerAndroidLink} target="_blank">
                        <img src={Playstore} className="h-10 rounded-xl" alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6 mt-6 mt-sm-0 text-center">
                    <a target="_blank" href={customerIosLink}>
                      <img src={CustomerIos} className="h-20 rounded-xl" alt="" />
                    </a>
                    <div className="mt-3">
                      <a href={customerIosLink} target="_blank">
                        <img src={Appstore} className="h-10 rounded-xl" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /column */}
          </div>
          <div className="row align-items-center">
            {/* /column */}
            <div className="col-lg-5 me-auto">
              <h3 className="section-title post-title ls-sm mb-3 mobile-text-center">For Service Providers</h3>
              <h4 className="mobile-text-center">Real customers. Zero chasing.</h4>
              <p className="mobile-text-center">The Lynx Partner App connects you with homeowners who actually need your help - no bidding wars, no junk leads.</p>
              <div className="mobile-text-center">
                <ul className="icon-list bullet-bg bullet-soft-primary" style={{ display: 'inline-block', textAlign: 'left' }}>
                  <li><i className="uil uil-check" />Work smarter, respond faster, and stay in control - right from your phone.</li>
                  <li><i className="uil uil-check" />Available now on iOS and Android.</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 order-lg-2">

              <div className="card-body p-5 text-center border shadow-lg">
                <div className="row">
                  <div className="col-md-6 col-sm-6 text-center">
                    <a target="_blank" href={providerAndroidLink} className="d-inline-flex position-relative qr-blog">
                      <img src={ProviderAndroid} className="h-20 rounded-xl" alt="" />
                      {/* <ComingSoonBadge /> */}
                    </a>
                    <div className="mt-3">
                      <a target="_blank" href={providerAndroidLink}>
                        <img src={Playstore} className="h-10 rounded-xl" alt="" />
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-6 mt-6 mt-sm-0 text-center">
                    <a target="_blank" href={providerIosLink} className="d-inline-flex position-relative qr-blog">
                      <img src={ProviderIos} className="h-20 rounded-xl" alt="" />
                      {/* <ComingSoonBadge /> */}
                    </a>
                    <div className="mt-3">
                      <a href={providerIosLink}>
                        <img src={Appstore} className="h-10 rounded-xl" alt="" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /column */}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default DownloadMainContent; 