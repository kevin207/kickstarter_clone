import React from "react";

const CustomButton = ({ btnType, title, handleClick, styles, disabled }) => {
  return (
    <button
      disabled={disabled}
      type={btnType}
      className={`font-epilogue font-semibold text-[15px] leading-[26px] text-white min-h-[52px] px-6 rounded-[10px] ${styles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default CustomButton;
