import React, { lazy, Suspense, useCallback, useEffect } from "react";
const ContactInformationSection = lazy(() => import("./ContactInformationSection/ContactInformationSection"));
import { useReturningUserBookingStore } from "../stores";

interface Props {
  user: { email?: string; name?: string; phone?: string } | null;
  userPhone: string | null;
}

const ContactInformationContainer: React.FC<Props> = ({ user, userPhone }) => {
  const { contactInfo, updateContactInfo, setContactInfo } = useReturningUserBookingStore();

  // Autofill from authenticated user (keeps parity with previous behavior)
  useEffect(() => {
    if (!user) return;
    const phoneNumber = userPhone || user.phone || "";
    setContactInfo({
      email: user.email || "",
      fullName: user.name || "",
      phoneNumber,
    });
  }, [setContactInfo, user, userPhone]);

  const handleEmailChange = useCallback(
    (email: string) => updateContactInfo({ email }),
    [updateContactInfo]
  );

  const handleFullNameChange = useCallback(
    (fullName: string) => updateContactInfo({ fullName }),
    [updateContactInfo]
  );

  const handlePhoneNumberChange = useCallback(
    (phoneNumber: string) => updateContactInfo({ phoneNumber }),
    [updateContactInfo]
  );

  return (
    <Suspense fallback={null}>
      <ContactInformationSection
        email={contactInfo.email}
        fullName={contactInfo.fullName}
        phoneNumber={contactInfo.phoneNumber}
        onEmailChange={handleEmailChange}
        onFullNameChange={handleFullNameChange}
        onPhoneNumberChange={handlePhoneNumberChange}
      />
    </Suspense>
  );
};

export default ContactInformationContainer;

