"use client";

export function HeroGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base — pure white */}
      <div className="absolute inset-0 bg-white" />

      {/* Centered gradient wash — inspired by reference palette */}
      <div
        className="absolute left-1/2 top-0 h-[70vh] w-[110%] -translate-x-1/2"
        style={{
          background: `
            radial-gradient(45% 50% at 50% 0%, rgba(131, 200, 255, 0.25) 0%, transparent 100%),
            radial-gradient(35% 40% at 35% 30%, rgba(102, 134, 228, 0.15) 0%, transparent 100%),
            radial-gradient(35% 40% at 65% 30%, rgba(102, 134, 228, 0.15) 0%, transparent 100%),
            radial-gradient(50% 45% at 50% 15%, rgba(140, 170, 240, 0.12) 0%, transparent 100%)
          `,
        }}
      />

      {/* Animated orbs — symmetric, blue-lavender only */}
      <div className="absolute inset-0">
        {/* Left orb — sky blue */}
        <div
          className="absolute left-[15%] top-[0%] h-[600px] w-[600px] rounded-full blur-[150px] animate-fluid-1"
          style={{
            background: "radial-gradient(circle, rgba(131, 200, 255, 0.35) 0%, transparent 60%)",
          }}
        />

        {/* Right orb — mirror of left */}
        <div
          className="absolute right-[15%] top-[0%] h-[600px] w-[600px] rounded-full blur-[150px] animate-fluid-2"
          style={{
            background: "radial-gradient(circle, rgba(131, 200, 255, 0.35) 0%, transparent 60%)",
          }}
        />

        {/* Center orb — periwinkle/indigo */}
        <div
          className="absolute left-1/2 top-[5%] h-[550px] w-[700px] -translate-x-1/2 rounded-full blur-[140px] animate-fluid-3"
          style={{
            background: "radial-gradient(circle, rgba(102, 134, 228, 0.2) 0%, transparent 55%)",
          }}
        />

        {/* Subtle lavender glow — centered */}
        <div
          className="absolute left-1/2 top-[-5%] h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[160px] animate-fluid-4"
          style={{
            background: "radial-gradient(circle, rgba(160, 150, 230, 0.14) 0%, transparent 55%)",
          }}
        />
      </div>

      {/* Fine noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Bottom fade to page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#FDFEFF] to-transparent" />
    </div>
  );
}
