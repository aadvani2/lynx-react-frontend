import "intl-tel-input/build/css/intlTelInput.css";
import intlTelInput from "intl-tel-input";
import { useEffect, useRef } from "react";
import type { PhoneInputProps } from "../../types/auth";

// Minimal interface for the bits we use from intl-tel-input instance
type IntlTelInstance = {
  getSelectedCountryData: () => { dialCode?: string; iso2?: string };
  destroy: () => void;
  setNumber: (number: string) => void;
  setCountry: (iso2: string) => void;
};

// Minimal options subset to avoid using any
type IntlTelOptions = {
  initialCountry: string;
  nationalMode: boolean;
  separateDialCode: boolean;
  formatOnDisplay: boolean;
  utilsScript: string;
  autoPlaceholder: "polite" | "aggressive" | "off";
};

const PhoneInput = ({ onChange, initialValue = "", defaultCountry = "us", name = "phone", id = "phone", placeholder = "Phone", className = "form-control", maxLength = 16, disabled, required }: PhoneInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const itiRef = useRef<IntlTelInstance | null>(null);
  const onChangeRef = useRef<PhoneInputProps["onChange"] | undefined>(undefined);
  onChangeRef.current = onChange;

  // Initialize once
  useEffect(() => {
    const input = inputRef.current;
    if (!input || typeof window === "undefined") return;

    const options: IntlTelOptions = {
      initialCountry: defaultCountry || "us",
      nationalMode: false,
      separateDialCode: true,
      formatOnDisplay: true,
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@25.2.1/build/js/utils.js",
      autoPlaceholder: "aggressive",
    };
    const iti = intlTelInput(input, options as unknown as Partial<Record<string, unknown>>) as unknown as IntlTelInstance;
    itiRef.current = iti;

    if (initialValue) {
      try {
        iti.setNumber(initialValue);
      } catch {
        input.value = initialValue;
      }
    }

    const handleUpdate = () => {
      const data = iti.getSelectedCountryData();
      const dialCode = data?.dialCode || "1";
      const isoCode = (data?.iso2 || "us").toUpperCase();
      const phone = input.value;
      onChangeRef.current?.({ phone, countryCode: dialCode, countryIso: isoCode });
    };

    // Add number-only validation
    const handleInputValidation = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const currentValue = target.value;
      
      // Remove any non-numeric characters except + (for country code)
      const numericValue = currentValue.replace(/[^\d+]/g, '');
      
      // If the value changed due to filtering, update the input
      if (numericValue !== currentValue) {
        target.value = numericValue;
        // Trigger the update handler
        handleUpdate();
      }
    };

    handleUpdate();
    input.addEventListener("countrychange", handleUpdate);
    input.addEventListener("input", handleUpdate);
    input.addEventListener("input", handleInputValidation);

    return () => {
      input.removeEventListener("countrychange", handleUpdate);
      input.removeEventListener("input", handleUpdate);
      input.removeEventListener("input", handleInputValidation);
      if (itiRef.current) {
        itiRef.current.destroy();
        itiRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to initialValue changes after mount without re-initializing
  useEffect(() => {
    const input = inputRef.current;
    const iti = itiRef.current;
    if (!input || !iti) return;

    try {
      if (initialValue) {
        iti.setNumber(initialValue);
      } else {
        iti.setNumber("");
      }
    } catch {
      input.value = initialValue || "";
    }

    const data = iti.getSelectedCountryData();
    const dialCode = data?.dialCode || "1";
    const isoCode = (data?.iso2 || "us").toUpperCase();
    const phone = input.value;
    onChangeRef.current?.({ phone, countryCode: dialCode, countryIso: isoCode });
  }, [initialValue]);

  // React to defaultCountry changes after mount
  useEffect(() => {
    const iti = itiRef.current;
    if (!iti || !defaultCountry) return;
    try {
      iti.setCountry(defaultCountry.toLowerCase());
    } catch {
      // ignore
    }
    const input = inputRef.current;
    if (!input) return;
    const data = iti.getSelectedCountryData();
    const dialCode = data?.dialCode || "1";
    const isoCode = (data?.iso2 || "us").toUpperCase();
    const phone = input.value;
    onChangeRef.current?.({ phone, countryCode: dialCode, countryIso: isoCode });
  }, [defaultCountry]);

  return (
    <input
      type="tel"
      name={name}
      className={className}
      placeholder={placeholder}
      id={id}
      maxLength={maxLength}
      ref={inputRef}
      disabled={disabled}
      required={required}
    />
  );
};

export default PhoneInput;