/* Blog posts. Add a new object to POSTS to publish — it appears on /blog,
   gets its own page, sitemap entry and Article structured data automatically.
   Write for people first: answer the question fully, link to relevant collections. */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "cta"; text: string; href: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  updated?: string;
  readMinutes: number;
  cover?: string;
  tags: string[];
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "poster-size-guide-a4-a3-a2-a1",
    title: "Poster Size Guide: A4 vs A3 vs A2 vs A1 — Which Size Fits Your Wall?",
    description:
      "Confused between A4, A3, A2 and A1 posters? See exact dimensions in cm and inches, how big each looks on a wall, and which size suits bedrooms, desks and hostel rooms.",
    date: "2026-11-24",
    readMinutes: 5,
    tags: ["size guide", "wall decor", "posters"],
    body: [
      { type: "p", text: "Picking the right poster size is the difference between a wall that looks intentional and one that looks empty. Here is a simple guide to the four standard sizes, with real dimensions and where each one works best." },
      { type: "h2", text: "Poster sizes at a glance" },
      {
        type: "table",
        head: ["Size", "Centimetres", "Inches (approx.)", "Best for"],
        rows: [
          ["A4", "21 × 29.7 cm", "8.3 × 11.7 in", "Desks, shelves, small gallery walls"],
          ["A3", "29.7 × 42 cm", "11.7 × 16.5 in", "Bedrooms, study tables, hostel rooms"],
          ["A2", "42 × 59.4 cm", "16.5 × 23.4 in", "Above a bed or desk — a clear focal point"],
          ["A1", "59.4 × 84.1 cm", "23.4 × 33.1 in", "Large empty walls, living rooms, gaming setups"],
        ],
      },
      { type: "p", text: "Each size is exactly double the one before it: two A4 sheets make an A3, two A3 make an A2, and so on. So moving up one size doubles how much wall the poster covers." },
      { type: "h2", text: "How to choose the right size" },
      { type: "h3", text: "1. Measure the wall space" },
      { type: "p", text: "A good rule of thumb is that art should fill roughly half to two-thirds of the empty wall area it sits in. Above a single bed (about 90 cm wide), an A2 or A1 poster looks balanced. Above a study desk, A3 or A2 usually works best." },
      { type: "h3", text: "2. Think about viewing distance" },
      { type: "p", text: "If you look at the poster from your desk chair, A4 or A3 is enough. If it is seen from across the room — like a living room or the wall behind your gaming monitor — go for A2 or A1 so the details still read clearly." },
      { type: "h3", text: "3. Single statement or gallery wall?" },
      { type: "p", text: "One A1 poster makes a bold statement. For a gallery wall, mix three to six A4 and A3 posters with equal gaps (about 5 cm) between them. Keeping one theme — say, all anime or all cars — makes a mixed-size wall feel planned." },
      { type: "h2", text: "Quick recommendations" },
      {
        type: "list",
        items: [
          "Hostel or PG room: A3 — big enough to notice, easy to move.",
          "Bedroom wall above the bed: A2 or A1.",
          "Gaming setup behind the monitor: A2 single, or a 3-panel split poster.",
          "Desk or bookshelf: A4.",
          "Gifting: A3 is the safest choice — fits almost any wall.",
        ],
      },
      { type: "p", text: "Want something even bigger than A1? A split poster spreads one artwork across multiple panels, covering a large wall without needing one oversized print." },
      { type: "cta", text: "Shop all posters — A4 to A1", href: "/shop" },
    ],
  },
  {
    slug: "what-are-split-posters-how-to-hang",
    title: "What Are Split Posters? How to Hang a 3-Panel or 5-Panel Wall Art Set",
    description:
      "Split posters turn one artwork into a multi-panel wall installation. Learn what they are, how much space they need, and a step-by-step method to hang them perfectly aligned.",
    date: "2026-11-24",
    readMinutes: 6,
    tags: ["split posters", "how to", "wall decor"],
    body: [
      { type: "p", text: "A split poster (also called multi-panel or triptych wall art) is a single artwork printed across two to five separate panels. Hung side by side with small gaps, the panels form one large picture — a gallery-wall look without a giant frame." },
      { type: "h2", text: "Why choose a split poster?" },
      {
        type: "list",
        items: [
          "Covers a big wall: a 3-panel set spans far more width than a single A1 poster.",
          "Easier to handle: smaller panels are simpler to ship, carry and hang than one huge print.",
          "Looks premium: the gaps between panels add depth and a modern, gallery-style finish.",
          "Great for wide spaces: above a bed, sofa or a long gaming desk.",
        ],
      },
      { type: "h2", text: "How much wall space do you need?" },
      { type: "p", text: "Add up the widths of all panels plus the gaps. For example, three panels that are each 30 cm wide with 4 cm gaps need about 98 cm of width. Leave at least 15–20 cm of empty wall on each side so the set doesn't look cramped." },
      { type: "h2", text: "What you'll need" },
      {
        type: "list",
        items: [
          "Measuring tape and a pencil",
          "A spirit level (or a level app on your phone)",
          "Double-sided mounting tape, poster putty, or adhesive strips (removable strips are best for rented rooms)",
          "A friend to hold panels — optional but helpful",
        ],
      },
      { type: "h2", text: "Step-by-step: hanging a split poster" },
      {
        type: "list",
        items: [
          "Lay the panels on the floor in order and decide the gap — 3 to 5 cm looks best.",
          "Find the centre of your wall space and mark it lightly with a pencil.",
          "Hang the middle panel first (for 3 or 5 panels), centred on your mark, using the level to keep it straight.",
          "Use a piece of card cut to your gap width as a spacer to place the next panel beside it.",
          "Check the top edges line up with the level before pressing each panel firmly.",
          "Step back, check from across the room, and adjust before the adhesive fully sets.",
        ],
      },
      { type: "h2", text: "Tips for the best look" },
      {
        type: "list",
        items: [
          "Hang the centre of the artwork at roughly eye level — about 145–150 cm from the floor — unless it sits above furniture.",
          "Above a bed or sofa, keep the bottom edge 20–25 cm above the headboard or backrest.",
          "Let the poster flatten for a few hours (rolled the other way) before hanging so the corners don't curl.",
        ],
      },
      { type: "cta", text: "Browse split posters", href: "/shop/split-poster" },
    ],
  },
  {
    slug: "how-to-hang-posters-without-damaging-walls",
    title: "How to Put Up Posters Without Damaging Walls (Hostel & Rented Room Friendly)",
    description:
      "No nails, no peeling paint. Five safe ways to stick posters on walls in hostels, PGs and rented flats — plus how to remove them cleanly and stop corners from curling.",
    date: "2026-11-24",
    readMinutes: 5,
    tags: ["how to", "hostel room", "wall decor"],
    body: [
      { type: "p", text: "Living in a hostel, PG or rented flat doesn't mean bare walls. These methods keep your posters up and your security deposit safe." },
      { type: "h2", text: "1. Removable adhesive strips" },
      { type: "p", text: "Picture-hanging strips grip strongly and peel off cleanly when you pull the tab straight down. They are the safest option for painted walls and work well for A3 to A1 posters." },
      { type: "h2", text: "2. Poster putty (blu-tack style)" },
      { type: "p", text: "Roll small balls and press them on each corner plus the middle of each long edge. Putty is cheap and reusable, though on very hot walls it can soften — use a little more in summer." },
      { type: "h2", text: "3. Washi or masking tape" },
      { type: "p", text: "Decorative washi tape on the corners gives an aesthetic, Pinterest-style look and is very gentle on paint. Best for lightweight A4 and A3 posters." },
      { type: "h2", text: "4. Clip frames or bulldog clips" },
      { type: "p", text: "Hang a clip from a single removable hook, or use a wooden hanger frame that clamps the top and bottom edges. This also protects the poster and makes it easy to swap designs." },
      { type: "h2", text: "5. Pin boards and cork panels" },
      { type: "p", text: "If wall adhesives are banned, mount a cork or foam board and pin your posters to it. Great for rotating a collection." },
      { type: "h2", text: "Stop corners from curling" },
      {
        type: "list",
        items: [
          "Unroll the poster and roll it gently the opposite way for a few minutes.",
          "Or lay it flat under a few books overnight before hanging.",
          "Fix all four corners, not just the top two.",
        ],
      },
      { type: "h2", text: "Removing posters cleanly" },
      { type: "p", text: "Peel slowly and parallel to the wall. If tape resists, warm it for a few seconds with a hair dryer to soften the adhesive. Leftover putty lifts off by dabbing it with a fresh ball of putty." },
      { type: "cta", text: "Find posters for your room", href: "/shop" },
    ],
  },
  {
    slug: "anime-room-decor-ideas",
    title: "Anime Room Decor Ideas: How to Style Your Walls with Anime Posters",
    description:
      "Turn your room into an anime fan's dream. Gallery wall layouts, colour tips, split-poster statement walls and series ideas from Naruto, One Piece, Demon Slayer and more.",
    date: "2026-11-24",
    readMinutes: 6,
    tags: ["anime", "room decor", "ideas"],
    body: [
      { type: "p", text: "Anime posters are the fastest way to make a room feel like yours. The trick is to plan the wall instead of sticking prints up at random. Here are layouts and ideas that work in bedrooms, hostel rooms and gaming corners." },
      { type: "h2", text: "1. Pick a theme" },
      { type: "p", text: "A wall reads better with one idea behind it. Choose a single series (all Naruto or all One Piece), a character arc, or a colour mood — for example dark posters for a moody gaming corner, or bright, warm art for a bedroom." },
      { type: "h2", text: "2. Build a gallery wall" },
      {
        type: "list",
        items: [
          "Start with one larger centre piece (A2) at eye level.",
          "Add two to four A3 or A4 posters around it with equal 5 cm gaps.",
          "Keep either the top edges or the centre line aligned for a clean look.",
          "Plan it on the floor first, or tape paper cut-outs to the wall before sticking the real posters.",
        ],
      },
      { type: "h2", text: "3. Make one statement wall with a split poster" },
      { type: "p", text: "A 3-panel or 5-panel split poster of an epic scene — a final battle, a crew line-up, or a dramatic character close-up — instantly becomes the focal point of the room. It works especially well above a bed or a wide desk." },
      { type: "h2", text: "4. Match posters to your lighting" },
      { type: "p", text: "Matte posters don't reflect light, so they look good next to RGB strips and fairy lights. Warm lights suit pastel or aesthetic anime art; cool or RGB lighting makes darker, high-contrast posters pop." },
      { type: "h2", text: "5. Popular series to start with" },
      {
        type: "list",
        items: [
          "Naruto & Boruto — great for bold orange accents.",
          "One Piece — Straw Hat crew and wanted-poster style art.",
          "Demon Slayer — striking colours and dramatic action scenes.",
          "Jujutsu Kaisen — high-contrast art that suits dark rooms.",
          "Dragon Ball — classic, nostalgic and loud.",
        ],
      },
      { type: "h2", text: "6. Keep it fresh" },
      { type: "p", text: "Use removable strips or clip frames so you can rotate posters when a new season drops. A small rotation of two or three favourites keeps the wall interesting all year." },
      { type: "cta", text: "Shop anime posters", href: "/shop/anime" },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
export const sortedPosts = () => [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
