import { forwardRef } from 'react';
import { classNames } from '../../../utils/helpers';

const Input = forwardRef((props, ref) => {
  const {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    containerClassName = '',
    ...rest
  } = props;

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={classNames(
            "block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-red-300 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...rest}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={classNames(
          "mt-1 text-sm",
          error ? "text-red-600" : "text-gray-500"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;