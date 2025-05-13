'use client';

import { motion } from 'framer-motion';

type Props = {
  label: string;
  value: number | string;
  delay?: number;
  ringColor: string;
};

export default function AnimatedStat({ label, value, delay = 0, ringColor }: Props) {
  // Define responsive size values
  const size = 160; // Base (mobile)
  const smSize = 200; // For sm screens
  const lgSize = 240; // For lg+ screens

  // Circle calculations based on base size
  const radius = 70;
  const strokeWidth = 12;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center w-40 h-40 sm:w-52 sm:h-52 lg:w-60 lg:h-60">
      <svg
        width={size}
        height={size}
        className="w-full h-full"
        viewBox={`0 0 ${size} ${size}`}
      >
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

      <div className="absolute text-center px-2">
        <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 break-words">
          {value}
        </div>
        <div className="text-sm sm:text-base lg:text-lg text-gray-500 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}
