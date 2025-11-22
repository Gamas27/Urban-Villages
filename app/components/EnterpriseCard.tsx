import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface EnterpriseCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glassmorphism?: boolean;
}

export function EnterpriseCard({ 
  children, 
  className = '', 
  hoverEffect = false,
  glassmorphism = false 
}: EnterpriseCardProps) {
  const baseStyles = glassmorphism
    ? 'bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl'
    : 'bg-white border border-gray-100 shadow-lg shadow-gray-200/50';

  const hoverStyles = hoverEffect
    ? 'transition-all duration-300 hover:shadow-2xl hover:shadow-gray-300/50 hover:-translate-y-1 active:scale-98'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={`rounded-2xl overflow-hidden ${baseStyles} ${hoverStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
}
