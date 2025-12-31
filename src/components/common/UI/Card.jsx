const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white overflow-hidden shadow rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;