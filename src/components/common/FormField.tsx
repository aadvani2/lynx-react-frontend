import React from 'react';

interface FormFieldProps {
  type: 'text' | 'email' | 'password';
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
  showPasswordToggle?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  type,
  name,
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  showPasswordToggle = false
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`form-floating mb-4 ${showPasswordToggle ? 'password-field' : ''} ${className}`}>
      <input
        type={inputType}
        name={name}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        placeholder={placeholder || label}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
      />
      
      {showPasswordToggle && (
        <span 
          className="password-toggle" 
          onClick={handlePasswordToggle}
          style={{ cursor: 'pointer' }}
        >
          <i className={`uil ${showPassword ? 'uil-eye-slash' : 'uil-eye'}`} />
        </span>
      )}
      
      <label htmlFor={name}>{label}</label>
      
      {error && (
        <div className="invalid-feedback">
          {error}
        </div>
      )}
    </div>
  );
}; 