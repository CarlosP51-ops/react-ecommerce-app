import { classNames } from '../../../utils/helpers';

const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-indigo-100 text-indigo-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <span
      className={classNames(
        'inline-flex items-center font-medium',
        variants[variant],
        sizes[size],
        roundedClasses[rounded],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;