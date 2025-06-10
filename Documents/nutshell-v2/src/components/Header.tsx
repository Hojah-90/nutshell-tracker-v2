import React from "react";

interface HeaderProps {
  headerFont?: string; // Make optional with a default
}

const Header: React.FC<HeaderProps> = ({ headerFont = "Sacramento" }) => {
  const headerStyle = {
    fontFamily: `${headerFont}, cursive`,
    color: "#4B0082", // Matches text-lavender-dark
    textAlign: "center" as const,
  };

  return (
    <header style={headerStyle}>
      <h2 className="font-sacramento text-lavender-dark">
        {new Date().toLocaleString("default", { month: "long" })} {new Date().getFullYear()}
      </h2>
    </header>
  );
};

export default Header;