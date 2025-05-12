'use client';

import { motion } from 'framer-motion';

type Props = {
  label: string;
  value: number | string;
  delay?: number;
  ringColor: string; // e.g., "#3b82f6"
};

export default function AnimatedStat({ label, value, delay = 0, ringColor }: Props) {
  const radius = 85; // increased from 60
  const strokeWidth = 14;
  const size = 200;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="w-52 h-52 relative flex items-center justify-center">
      {/* SVG Ring */}
      <svg width={size} height={size}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
            delay,
          }}
        />
      </svg>

      {/* Centered Text */}
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-gray-800 break-words">{value}</div>
        <div className="text-base text-gray-500 mt-1">{label}</div>
      </div>
    </div>
  );
}
