"use client";

import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Linkedin, Github, Twitter, Globe } from "lucide-react";

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
    socials?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      website?: string;
    };
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <>
      {items.map((item) => (
        <div
          className="group relative -mr-4"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-base font-bold text-white">
                  {item.name}
                </div>
                <div className="text-xs text-white">{item.designation}</div>
                
                {/* Social Media Links */}
                {item.socials && (
                  <div className="mt-2 flex items-center justify-center space-x-2">
                    {item.socials.linkedin && (
                      <a
                        href={item.socials.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-gray-800 p-1 text-white transition-all hover:bg-blue-600 hover:scale-110"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {item.socials.github && (
                      <a
                        href={item.socials.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-gray-800 p-1 text-white transition-all hover:bg-gray-600 hover:scale-110"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {item.socials.twitter && (
                      <a
                        href={item.socials.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-gray-800 p-1 text-white transition-all hover:bg-sky-500 hover:scale-110"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {item.socials.website && (
                      <a
                        href={item.socials.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-gray-800 p-1 text-white transition-all hover:bg-emerald-500 hover:scale-110"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className="relative !m-0 h-14 w-14 rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105"
          />
        </div>
      ))}
    </>
  );
};