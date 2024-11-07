// src/components/Separator.tsx

import React from "react";

interface SeparatorProps {
  text?: string;
}

const Separator: React.FC<SeparatorProps> = ({ text }) => {
  return (
    <div className="separator">
      {text ? <span className="separator-text">{text}</span> : <hr />}
    </div>
  );
};

export default Separator;
