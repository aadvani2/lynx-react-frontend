import React, { useEffect, useRef } from 'react';
import { loadSelect2 } from '../../../utils/externalLoaders';

interface ServiceTypeSelectorProps {
  defaultSelectedTypes?: string[];
}

const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({ defaultSelectedTypes = [] }) => {
  const serviceTypeSelectRef = useRef<HTMLSelectElement | null>(null);

  const serviceTypeOptions = [
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'other', label: 'Other' },
  ];

  // Initialize Select2 on demand
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        await loadSelect2();
        if (!isMounted || !serviceTypeSelectRef.current) return;
        const jq: any = (window as any).jQuery || (window as any).$;
        if (!jq) return;

        const el = jq(serviceTypeSelectRef.current);
        if (!el.hasClass('select2-hidden-accessible')) {
          el.select2({ placeholder: 'Select Service Type', width: '100%' });
        }
        if (defaultSelectedTypes.length > 0) {
          el.val(defaultSelectedTypes).trigger('change');
        }
        el.on('change', function () {
          // Parent handles any value propagation; keep minimal handler
        });
      } catch (err) {
        console.warn('Error initializing Select2:', err);
      }
    };

    init();

    return () => {
      isMounted = false;
      const jqCleanup: any = (window as any).jQuery || (window as any).$;
      if (jqCleanup && serviceTypeSelectRef.current) {
        try {
          const el = jqCleanup(serviceTypeSelectRef.current);
          if (el.hasClass('select2-hidden-accessible')) {
            el.off('change');
            el.select2('destroy');
          }
        } catch (err) {
          console.warn('Error cleaning up Select2:', err);
        }
      }
    };
  }, [defaultSelectedTypes]);

  // Update Select2 value when defaultSelectedTypes changes
  useEffect(() => {
    const jq: any = (window as any).jQuery || (window as any).$;
    if (jq && serviceTypeSelectRef.current) {
      const el = jq(serviceTypeSelectRef.current);
      // Only update if the value is different to avoid unnecessary triggers
      const currentVal = el.val();
      const currentSelected = Array.isArray(currentVal) ? currentVal : [];

      // Simple comparison to check if we need to update
      const needsUpdate = JSON.stringify(currentSelected.sort()) !== JSON.stringify([...defaultSelectedTypes].sort());

      if (needsUpdate) {
        el.val(defaultSelectedTypes).trigger('change');
      }
    }
  }, [defaultSelectedTypes]);

  return (
    <>
      <div className="col-md-12">
        <p className="lead mb-1 text-start">Select Services</p>
        <p className="mb-1">What type of work do you do?</p>
        <div className="form-floating mb-4">
          <select
            ref={serviceTypeSelectRef}
            className="select2"
            name="service_type[]"
            multiple
            data-placeholder="Select Service Type"
            style={{ width: '100%' }}
            defaultValue={defaultSelectedTypes}
          >
            {serviceTypeOptions.map(opt => (
              <option
                key={opt.value}
                value={opt.value}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default ServiceTypeSelector;
