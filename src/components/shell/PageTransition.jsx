import React from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="animate-fade-in motion-reduce:animate-none w-full"
    >
      {children}
    </div>
  );
};
