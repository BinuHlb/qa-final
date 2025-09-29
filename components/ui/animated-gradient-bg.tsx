'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedGradientBgProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientBg({ children, className = '' }: AnimatedGradientBgProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        
        {/* Subtle Animated Border - Main */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15), rgba(236, 72, 153, 0.15), transparent)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Subtle Animated Border - Secondary */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'linear-gradient(225deg, transparent, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1), rgba(236, 72, 153, 0.1), transparent)',
            backgroundSize: '300% 300%',
          }}
          animate={{
            backgroundPosition: ['100% 100%', '0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Subtle Animated Border - Accent */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(147, 51, 234, 0.08), transparent, rgba(236, 72, 153, 0.08), transparent)',
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Inner content area with proper border radius */}
        <div className="absolute inset-[1px] rounded-lg overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/20 dark:via-purple-950/15 dark:to-pink-950/20"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05), rgba(236, 72, 153, 0.05))',
                'linear-gradient(135deg, rgba(236, 72, 153, 0.05), rgba(59, 130, 246, 0.05), rgba(34, 197, 94, 0.05))',
                'linear-gradient(225deg, rgba(34, 197, 94, 0.05), rgba(236, 72, 153, 0.05), rgba(147, 51, 234, 0.05))',
                'linear-gradient(315deg, rgba(147, 51, 234, 0.05), rgba(34, 197, 94, 0.05), rgba(59, 130, 246, 0.05))',
                'linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05), rgba(236, 72, 153, 0.05))',
              ],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Subtle Floating SVG Shapes */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Circle 1 */}
            <motion.div
              className="absolute top-10 left-10 w-32 h-32"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="url(#gradient1)"
                  opacity="0.15"
                />
                <defs>
                  <radialGradient id="gradient1" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                    <stop offset="100%" stopColor="rgba(147, 51, 234, 0.05)" />
                  </radialGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Circle 2 */}
            <motion.div
              className="absolute top-20 right-20 w-24 h-24"
              animate={{
                x: [0, -40, 0],
                y: [0, 20, 0],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="url(#gradient2)"
                  opacity="0.12"
                />
                <defs>
                  <radialGradient id="gradient2" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(236, 72, 153, 0.18)" />
                    <stop offset="100%" stopColor="rgba(34, 197, 94, 0.04)" />
                  </radialGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Triangle */}
            <motion.div
              className="absolute bottom-20 left-1/4 w-20 h-20"
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
                rotate: [0, 120, 240, 360],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50,10 90,80 10,80"
                  fill="url(#gradient3)"
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(147, 51, 234, 0.15)" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0.04)" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Square */}
            <motion.div
              className="absolute bottom-10 right-1/3 w-16 h-16"
              animate={{
                x: [0, -25, 0],
                y: [0, 15, 0],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect
                  x="25"
                  y="25"
                  width="50"
                  height="50"
                  rx="10"
                  fill="url(#gradient4)"
                  opacity="0.08"
                />
                <defs>
                  <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(34, 197, 94, 0.12)" />
                    <stop offset="100%" stopColor="rgba(236, 72, 153, 0.03)" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Hexagon */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-12 h-12"
              animate={{
                x: [0, 20, -20, 0],
                y: [0, -15, 15, 0],
                rotate: [0, 60, 120, 180, 240, 300, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50,5 85,25 85,75 50,95 15,75 15,25"
                  fill="url(#gradient5)"
                  opacity="0.06"
                />
                <defs>
                  <radialGradient id="gradient5" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                    <stop offset="100%" stopColor="rgba(147, 51, 234, 0.02)" />
                  </radialGradient>
                </defs>
              </svg>
            </motion.div>
          </motion.div>

          {/* Minimal Grid Pattern */}
          <motion.div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px'
            }}
            animate={{
              opacity: [0.02, 0.08, 0.02],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}