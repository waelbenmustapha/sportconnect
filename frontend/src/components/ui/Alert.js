import React from 'react';

const Alert = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles = 'p-4 rounded-lg border';
  const variantStyles = {
    default: 'bg-blue-100 border-blue-300 text-blue-900',
    destructive: 'bg-red-100 border-red-300 text-red-900',
  };

  return (
    <div
      role="alert"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertDescription = ({ children, className = '', ...props }) => {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Alert, AlertDescription };