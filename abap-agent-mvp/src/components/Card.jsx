import React from 'react';
import clsx from 'clsx';

const Card = ({
  children,
  className,
  hover = false,
  padding = 'default',
  ...props
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-md';

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(
        baseStyles,
        paddingStyles[padding],
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
