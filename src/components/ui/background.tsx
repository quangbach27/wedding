type Heart = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
};
const COLORS = [
  "var(--color-gold)",
  "var(--color-gold-light)",
  "var(--color-mint)",
  "var(--color-green)",
];

const HEARTS = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37) % 100, // spread across the width
  size: 12 + ((i * 7) % 5) * 4, // 12 to 28 px
  duration: 12 + ((i * 5) % 11) * 1.3, // 12 to 25 s
  delay: -((i * 3) % 20), // already mid-fall at load
  drift: ((i * 29) % 120) - 60, // -60 to 60 px
  color: COLORS[i % COLORS.length],
}));

export default function Background() {
  return (
    <>
      {/* Soft green glows */}
      <div className="bg-mint pointer-events-none fixed top-[-8%] left-[-10%] z-0 h-55 w-55 rounded-full opacity-40 blur-[90px] md:h-115 md:w-115" />
      <div className="bg-gold pointer-events-none fixed top-[35%] right-[-12%] z-0 h-47.5 w-47.5 rounded-full opacity-35 blur-[90px] md:h-100 md:w-100" />
      <div className="bg-mint pointer-events-none fixed bottom-[-10%] left-[-20%] z-0 h-50 w-50 rounded-full opacity-30 blur-[100px] md:h-105 md:w-105" />

      {/* Falling hearts */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {HEARTS.map((h, i) => (
          <svg
            key={i}
            className="heart absolute top-0"
            viewBox="0 0 24 24"
            width={h.size}
            height={h.size}
            fill={h.color}
            style={
              {
                left: `${h.left}%`,
                opacity: 0,
                "--drift": `${h.drift}px`,
                animation: `fall ${h.duration}s linear ${h.delay}s infinite`,
              } as React.CSSProperties
            }
          >
            <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.6 5 6 5c2 0 3.4 1 4 2.2h4C14.6 6 16 5 18 5c3.4 0 5.1 3.4 3.6 6.8C19.5 16.4 12 21 12 21z" />
          </svg>
        ))}
      </div>
    </>
  );
}
