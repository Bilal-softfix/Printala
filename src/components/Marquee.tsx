export default function Marquee() {
  const items = [
    "ANIME",
    "GAMING",
    "CARS",
    "CRICKET",
    "SPLIT POSTERS",
    "MOVIES",
    "SPORTS",
    "MUSIC",
  ];

  return (
    <section
      className="py-4 border-y-3 border-charcoal bg-yellow overflow-hidden"
      aria-hidden="true"
    >
      <div className="marquee-track">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex items-center gap-0 whitespace-nowrap pr-4"
          >
            {items.map((item, j) => (
              <span key={`${i}-${j}`} className="flex items-center gap-4 px-4">
                <span className="font-comic text-4xl md:text-5xl text-charcoal tracking-wide">
                  {item}
                </span>
                <span className="text-magenta text-3xl">★</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
