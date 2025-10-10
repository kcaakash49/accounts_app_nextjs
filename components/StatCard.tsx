'use client';

import { motion } from 'framer-motion';

type StatCardProps = {
  label: string;
  value: number | string;
  color: string; // main color for the card accent
  delay?: number;
};

export default function StatCard({ label, value, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow border-t-8 min-h-[120px]"
      style={{ borderTopColor: color }}
    >
      {/* Value */}
      <div className="text-sm sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 truncate max-w-full text-center break-words">
        {value}
      </div>

      {/* Label */}
      <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center truncate max-w-full break-words">
        {label}
      </p>
    </motion.div>
  );
}
