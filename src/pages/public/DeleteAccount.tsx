import React from 'react';

const DeleteAccount: React.FC = () => {
    return (
        <>
            <section className="wrapper image-wrapper bg-yellow">
                <div className="container pt-16 pb-6 text-center">
                    <div className="row">
                        <div className="col-lg-10 col-xl-10 col-xxl-10 mx-auto">
                            <div className="post-header">
                                <h1 className="display-1 mb-4">Delete Account</h1>
                            </div>
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

            <section className="wrapper bg-light">
                <div className="container pt-6 pb-10">
                    <div className="row gx-md-5 gy-5">
                        <div className="col-lg-12 terms-page">
                            <p>Welcome to our data deletion page.</p>
                            <p>Thank you for using our app. If you wish to delete your account and all associated data, please follow the steps below.</p>
                            <h2><span style={{ fontSize: 24 }}>Steps to Delete Your Account:</span></h2>
                            <ol>
                                <li><strong>Log In to Your Account:</strong> Open the app and navigate to the Profile section. Tap on Settings.</li>
                                <li><strong>Access Delete Account Option:</strong> Find the Delete Account option. Tap on Delete Account to proceed.</li>
                                <li><strong>Confirm Deletion:</strong> You will be prompted to confirm that you want to delete your account. Please review the information carefully, as this action cannot be undone.</li>
                                <li><strong>Complete Deletion:</strong> Once confirmed, your account and all associated data will be deleted. You will receive a confirmation email to the address linked to your account.</li>
                            </ol>
                            <h2><span style={{ fontSize: 24 }}>Important Notes:</span></h2>
                            <ul>
                                <li><strong>Irreversibility:</strong> Deleting your account is a permanent action and cannot be reversed.</li>
                                <li><strong>Data Retention:</strong> We comply with legal requirements regarding data retention. However, all personal data will be removed from our active systems.</li>
                                <li><strong>Support:</strong> If you need assistance during this process, please reach out to our support team via the contact information provided on our website.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

        </>

    );
};

export default DeleteAccount; 