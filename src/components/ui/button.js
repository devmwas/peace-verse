import React from "react";
import { motion } from "framer-motion";
import { COLORS } from "../../theme";

export const Button = ({
  children,
  onClick,
  type = "button",
  variant = "default",
  size = "md",
  disabled = false,
  className = "",
}) => {
  const baseStyles =
    "rounded-xl font-medium focus:outline-none focus:ring-2 transition-all duration-200";

  const variants = {
    default: `bg-[${COLORS.primary}] text-white hover:bg-[${COLORS.primaryDark}] focus:ring-[${COLORS.primary}]`,
    outline:
      "border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
    ghost:
      "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg",
  };

  const computedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`${computedClasses} ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
