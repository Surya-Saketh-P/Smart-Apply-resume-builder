import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("border border-black bg-[#FAF9F6] overflow-hidden", className)}>
    {children}
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }> = ({ children, className, variant = 'primary', ...props }) => {
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-black border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]",
    secondary: "bg-[#FAF9F6] text-zinc-900 border border-black hover:bg-white",
    danger: "bg-white text-red-700 border border-red-900 hover:bg-red-50",
    ghost: "bg-transparent text-zinc-700 border border-zinc-300 hover:border-black hover:bg-white"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-none px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:border-black disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'blue' | 'orange' | 'red' | 'gray' }> = ({ children, color = 'gray' }) => {
  const colors = {
    green: "bg-white text-zinc-900 border-black",
    blue: "bg-white text-zinc-900 border-black",
    orange: "bg-white text-zinc-900 border-black",
    red: "bg-white text-red-900 border-red-900",
    gray: "bg-white text-zinc-900 border-black"
  };

  return (
    <span className={cn("inline-flex items-center rounded-none border px-2.5 py-0.5 text-xs font-bold", colors[color])}>
      {children}
    </span>
  );
};
