import { IconSparkles, IconStar } from "@tabler/icons-react";
import React from "react";

const LoadingAI = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <style>
        {`
          @keyframes ai-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes ai-pulse-glow {
            0%, 100% {
              transform: scale(1);
              filter: drop-shadow(0 0 8px var(--primary-color));
            }
            50% {
              transform: scale(1.1);
              filter: drop-shadow(0 0 25px var(--primary-color));
            }
          }
          @keyframes ai-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes ai-spin-reverse {
            0% { transform: rotate(360deg); }
            100% { transform: rotate(0deg); }
          }
          @keyframes ai-twinkle {
            0%, 100% { opacity: 0.3; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          @keyframes ai-particle-rise {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-50px) scale(0); opacity: 0; }
          }
          @keyframes ai-shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes ai-ring-pulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.5); opacity: 0.1; }
          }
          .ai-float { animation: ai-float 2.5s ease-in-out infinite; }
          .ai-pulse-glow { animation: ai-pulse-glow 2s ease-in-out infinite; }
          .ai-spin { animation: ai-spin 4s linear infinite; }
          .ai-spin-fast { animation: ai-spin 2.5s linear infinite; }
          .ai-spin-reverse { animation: ai-spin-reverse 3s linear infinite; }
          .ai-twinkle { animation: ai-twinkle 1.5s ease-in-out infinite; }
          .ai-twinkle-d1 { animation: ai-twinkle 1.5s ease-in-out infinite 0.3s; }
          .ai-twinkle-d2 { animation: ai-twinkle 1.5s ease-in-out infinite 0.6s; }
          .ai-twinkle-d3 { animation: ai-twinkle 1.5s ease-in-out infinite 0.9s; }
          .ai-particle { animation: ai-particle-rise 2s ease-out infinite; }
          .ai-particle-d1 { animation: ai-particle-rise 2s ease-out infinite 0.4s; }
          .ai-particle-d2 { animation: ai-particle-rise 2s ease-out infinite 0.8s; }
          .ai-particle-d3 { animation: ai-particle-rise 2s ease-out infinite 1.2s; }
          .ai-shimmer {
            background: linear-gradient(90deg, var(--primary-color), #ffffff, var(--primary-color), #ffffff, var(--primary-color));
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: ai-shimmer 3s linear infinite;
          }
          .ai-ring-pulse { animation: ai-ring-pulse 2s ease-in-out infinite; }
          .ai-star { color: var(--primary-color); }
          .ai-star-80 { color: var(--primary-color); opacity: 0.8; }
          .ai-star-70 { color: var(--primary-color); opacity: 0.7; }
          .ai-star-60 { color: var(--primary-color); opacity: 0.6; }
          .ai-star-50 { color: var(--primary-color); opacity: 0.5; }
          .ai-star-40 { color: var(--primary-color); opacity: 0.4; }
          .ai-sparkle { color: var(--primary-color); }
          .ai-sparkle-80 { color: var(--primary-color); opacity: 0.8; }
          .ai-sparkle-70 { color: var(--primary-color); opacity: 0.7; }
          .ai-sparkle-60 { color: var(--primary-color); opacity: 0.6; }
          .ai-ring { border-color: var(--primary-color); }
          .ai-glow-bg { background-color: var(--primary-color); opacity: 0.2; }
        `}
      </style>

      {/* Main floating container */}
      <div className="relative ai-float">
        {/* Pulsing rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-20 h-20 border-2 rounded-full ai-ring ai-ring-pulse" style={{ opacity: 0.3 }} />
          <div className="absolute border rounded-full w-28 h-28 ai-ring ai-ring-pulse" style={{ animationDelay: "0.5s", opacity: 0.2 }} />
          <div className="absolute border rounded-full w-36 h-36 ai-ring ai-ring-pulse" style={{ animationDelay: "1s", opacity: 0.1 }} />
        </div>

        {/* Glowing background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full ai-glow-bg blur-xl ai-pulse-glow" />
        </div>

        {/* Main sparkle icon */}
        <div className="relative">
          <IconSparkles size={56} className="ai-sparkle ai-pulse-glow" />
        </div>

        {/* Outer orbiting ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-24 h-24 ai-spin">
            <IconStar size={14} className="absolute -translate-x-1/2 ai-star -top-1 left-1/2 ai-twinkle" />
            <IconStar size={12} className="absolute -translate-y-1/2 ai-star-80 top-1/2 -right-1 ai-twinkle-d1" />
            <IconStar size={10} className="absolute -translate-x-1/2 ai-star-60 -bottom-1 left-1/2 ai-twinkle-d2" />
            <IconStar size={11} className="absolute -translate-y-1/2 ai-star-70 top-1/2 -left-1 ai-twinkle-d3" />
          </div>
        </div>

        {/* Inner reverse orbiting ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-16 h-16 ai-spin-reverse">
            <IconStar size={8} className="absolute ai-star-50 -top-0.5 left-1/2 -translate-x-1/2 ai-twinkle-d2" />
            <IconStar size={9} className="absolute ai-star -bottom-0.5 left-1/2 -translate-x-1/2 ai-twinkle" />
          </div>
        </div>

        {/* Fast spinning small ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-32 h-32 ai-spin-fast">
            <IconStar size={6} className="absolute top-0 -translate-x-1/2 ai-star-40 left-1/2 ai-twinkle-d1" />
            <IconStar size={5} className="absolute bottom-0 -translate-x-1/2 ai-star-40 left-1/2 ai-twinkle-d3" />
          </div>
        </div>

        {/* Rising particles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <IconSparkles size={8} className="absolute ai-sparkle ai-particle" style={{ left: "20%" }} />
          <IconSparkles size={6} className="absolute ai-sparkle-80 ai-particle-d1" style={{ left: "40%" }} />
          <IconSparkles size={7} className="absolute ai-sparkle-60 ai-particle-d2" style={{ left: "60%" }} />
          <IconSparkles size={5} className="absolute ai-sparkle-70 ai-particle-d3" style={{ left: "80%" }} />
        </div>
      </div>

      {/* Animated text */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium ai-shimmer">AI đang xử lý</span>
      </div>
    </div>
  );
};

export default LoadingAI;
