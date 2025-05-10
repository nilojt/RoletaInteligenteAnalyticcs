import React from "react";
import { cn, getNumberClassName } from "@/lib/utils";

interface RouletteNumberProps {
  number: number;
  onClick?: (number: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RouletteNumber: React.FC<RouletteNumberProps> = ({ 
  number, 
  onClick, 
  size = 'md',
  className
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(number);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-9 h-9',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div 
      className={cn(
        "roulette-number", 
        getNumberClassName(number), 
        sizeClasses[size],
        onClick ? "cursor-pointer hover:scale-110" : "",
        className
      )}
      onClick={handleClick}
    >
      {number}
    </div>
  );
};

export default RouletteNumber;
