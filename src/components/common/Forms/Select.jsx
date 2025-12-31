import { forwardRef } from 'react';
import { classNames } from '../../../utils/helpers';

const Select = forwardRef((props, ref) => {
  const {
    label,
    options,
    error,
    helperText,
    placeholder = 'Sélectionner...',
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
      <select
        ref={ref}
        className={classNames(
          "block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

Select.displayName = 'Select';

export default Select;