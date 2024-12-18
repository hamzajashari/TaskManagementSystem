import React from 'react';

const ErrorHandling = ({ message }: { message: string }) => {
  return <div className="error">{message}</div>;
};

export default ErrorHandling;
