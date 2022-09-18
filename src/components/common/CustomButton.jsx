import React, { useState } from "react";

const CustomButton = ({
  icon,
  bgColor,
  color,
  bgHoverColor,
  text,
  borderRadius,
  width,
  height,
  onClick
}) => {
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const buttonStyle = {
    backgroundColor: isHover ? bgHoverColor: bgColor,
    display: "flex",
    justifyContent: "center",
    alignItems:"center",
    color,
    borderRadius,
    width: width,
    height: height,
    padding: "0.75rem",
    filter: isHover && "dropShadow(0 20px 13px rgb(0 0 0 / 0.03)) dropShadow(0 8px 5px rgb(0 0 0 / 0.08))"
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon} {text}
    </button>
  );
};

export default CustomButton;
