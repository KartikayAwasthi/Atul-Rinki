// Falling marigold / rose petals. Positions are deterministic so the
// markup is identical on server and client. Hidden for reduced-motion users.
const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i * 1.3) % 9,
  duration: 9 + ((i * 7) % 7),
  size: 8 + ((i * 5) % 8),
  drift: ((i % 2 ? 1 : -1) * (20 + ((i * 13) % 60))) + "px",
  color: i % 3 === 0 ? "#f59e0b" : i % 3 === 1 ? "#e11d48" : "#fbbf24",
}));

export function Petals() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal absolute top-0 block rounded-[60%_0_60%_0]"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--drift": p.drift,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
