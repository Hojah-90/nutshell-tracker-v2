import React from 'react';

interface HeaderProps {
  headerFont: string;
  monthColor: string;
}

const Header: React.FC<HeaderProps> = ({ headerFont, monthColor }) => {
  const headerStyle = {
    fontFamily: `${headerFont}, cursive`,
    color: monthColor,
  };

  return (
    <div className="relative z-0">
      <div className="month-splash" style={{ color: monthColor }}></div>
      <h1 className="paintbrush text-5xl font-bold text-center mb-4 relative z-10" style={headerStyle}>December 2025</h1>
    </div>
  );
};

export default Header;