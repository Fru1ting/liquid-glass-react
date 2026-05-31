import React, { useRef, useEffect, useState } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] glass-card ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassCard;
