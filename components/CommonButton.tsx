"use client";

const CommonButton = ({ label, bgColor, hoverColor, onClick } : {label: string, bgColor: string, hoverColor: string, onClick:()=> void}) => {
    return (
      <button
        onClick={onClick}
        className={`${bgColor} hover:${hoverColor} text-white px-3 py-1 rounded-md text-sm cursor-pointer`}
      >
        {label}
      </button>
    );
  };
  
  export default CommonButton;
  