
import React from 'react';
import VisitorHeader from './VisitorHeader';
import VisitorFooter from './VisitorFooter';

interface VisitorLayoutProps {
  children: React.ReactNode;
}

const VisitorLayout: React.FC<VisitorLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <VisitorHeader />
      <main className="flex-1 bg-gray-50 dark:bg-darkBlack">
        {children}
      </main>
      <VisitorFooter />
    </div>
  );
};

export default VisitorLayout;
