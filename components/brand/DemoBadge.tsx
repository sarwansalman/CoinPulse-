import React from 'react';

interface DemoBadgeProps {
  size?: 'sm' | 'md';
  variant?: 'cyan' | 'amber' | 'subtle';
  className?: string;
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({
  size = 'md',
  variant = 'cyan',
  className = '',
}) => {
  const styles = {
    cyan: 'bg-[#28D7E5]/10 text-[#28D7E5] border-[#28D7E5]/30',
    amber: 'bg-[#F5B942]/10 text-[#F5B942] border-[#F5B942]/30',
    subtle: 'bg-[#141F30] text-[#9AA8BB] border-[#233147]',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 tracking-wider',
    md: 'text-xs px-2 py-0.5 tracking-wide',
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold rounded border uppercase select-none ${styles[variant]} ${sizes[size]} ${className}`}
    >
      DEMO MODE
    </span>
  );
};
