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
  {
    slug: "gift-ideas-for-anime-fans-india",
    title: "Gift Ideas for Anime Fans in India: Posters They'll Actually Hang",
    description:
      "Looking for a gift for an anime fan? How to pick the right series, size and style of anime poster — plus split-poster ideas for birthdays, Rakhi, Diwali and farewells.",
    date: "2026-11-24",
    readMinutes: 5,
    tags: ["anime", "gift ideas", "posters"],
    body: [
      { type: "p", text: "Anime fans are easy to shop for once you know one thing: which series they love. A poster of their favourite character becomes something they look at every day — far more personal than a generic gift." },
      { type: "h2", text: "Step 1: Find their favourite series" },
      { type: "p", text: "Check their phone wallpaper, profile picture or recent rewatches. The most loved series in India include Naruto, One Piece, Demon Slayer, Jujutsu Kaisen, Dragon Ball, Attack on Titan and Spy x Family. If you can't find out, pick a 'big three' classic like Naruto or One Piece — almost every fan has a soft spot for them." },
      { type: "h2", text: "Step 2: Pick a size that fits their room" },
      {
        type: "list",
        items: [
          "Hostel or PG room: A3 — noticeable but easy to put up anywhere.",
          "Their own bedroom: A2 above the bed or desk.",
          "Big fan, big wall: a 3-panel split poster for a full statement.",
        ],
      },
      { type: "p", text: "Not sure? A3 is the safest gift size. Our poster size guide explains every size with exact dimensions." },
      { type: "h2", text: "Step 3: Choose the mood" },
      { type: "p", text: "Action fans love dramatic battle scenes. Others prefer calm, aesthetic character art in soft colours. If they decorate with RGB lights or a gaming setup, darker high-contrast posters look best; for bright rooms, pick colourful art." },
      { type: "h2", text: "Gift ideas by occasion" },
      {
        type: "list",
        items: [
          "Birthday: a split poster of their favourite character — it feels premium.",
          "Rakhi or Bhai Dooj: a set of two or three A4/A3 posters from the same series.",
          "Diwali: aesthetic anime art to refresh their room for the festive season.",
          "Farewell or graduation: a motivational character poster for their new room or office.",
        ],
      },
      { type: "h2", text: "Make it feel special" },
      { type: "p", text: "Add a handwritten note with their favourite quote from the series, and include a pack of removable poster strips so they can hang it the same day." },
      { type: "cta", text: "Browse anime posters", href: "/shop/anime" },
    ],
  },
  {
    slug: "gaming-setup-wall-decor-ideas",
    title: "Gaming Setup Wall Decor Ideas: Posters, Lighting & Layouts",
    description:
      "Level up the wall behind your gaming setup. Poster layouts, RGB lighting tips, split-poster statement walls and game themes from GTA, Valorant, God of War and more.",
    date: "2026-11-24",
    readMinutes: 5,
    tags: ["gaming", "room decor", "ideas"],
    body: [
      { type: "p", text: "The wall behind your monitor is in every stream, every video call and every photo of your setup. A few well-placed posters turn a plain wall into a proper battle station." },
      { type: "h2", text: "1. One big centre piece" },
      { type: "p", text: "Centre a large A2 or A1 poster above your monitor, or go wider with a 3-panel split poster that spans the length of your desk. Keep the bottom edge about 20–30 cm above the top of your monitor so it stays in frame on camera." },
      { type: "h2", text: "2. Side gallery" },
      { type: "p", text: "Flank the centre piece with two A3 posters at the same height. Matching frames, or matching games, keep it tidy — for example, the main character in the middle with secondary characters on either side." },
      { type: "h2", text: "3. Light it right" },
      {
        type: "list",
        items: [
          "Matte posters don't reflect light, so RGB strips and monitor glow won't wash them out.",
          "Place LED strips behind the desk or along the top of the wall to backlight the posters.",
          "Dark, high-contrast art pops under cool or RGB light; warm light suits colourful art.",
        ],
      },
      { type: "h2", text: "4. Game themes that look great on walls" },
      {
        type: "list",
        items: [
          "Open-world: GTA, Red Dead Redemption — cinematic landscapes.",
          "Shooters: Valorant agents, BGMI — bold colours and characters.",
          "Story games: God of War, The Last of Us — dramatic portraits.",
          "Sandbox: Minecraft — pixel art that suits younger gamers' rooms.",
        ],
      },
      { type: "h2", text: "5. Keep cables and clutter off the wall" },
      { type: "p", text: "A clean wall makes posters stand out. Use cable clips under the desk and keep shelves minimal around the art." },
      { type: "cta", text: "Shop gaming posters", href: "/shop/gaming" },
    ],
  },
  {
    slug: "cricket-posters-for-room",
    title: "Cricket Posters for Your Room: Ideas for Every Fan",
    description:
      "Dhoni, Kohli, Sachin, IPL and World Cup moments — ideas for decorating your room with cricket posters, from a single hero wall to a full stadium-style gallery.",
    date: "2026-11-24",
    readMinutes: 4,
    tags: ["cricket", "room decor", "ideas"],
    body: [
      { type: "p", text: "In India, cricket isn't just a sport — it's a mood. A cricket poster on your wall says exactly who you cheer for. Here's how to make it look great." },
      { type: "h2", text: "Pick your hero" },
      { type: "p", text: "Most fans build their wall around one legend: MS Dhoni's calm, Virat Kohli's aggression, Sachin Tendulkar's legacy, or the rising stars of today. One large A2 poster of your hero above the bed or desk becomes the centre of the room." },
      { type: "h2", text: "Celebrate a team" },
      { type: "p", text: "IPL fans can go all in with team colours — yellow for CSK, red for RCB, blue for MI. Pick posters with the same colour palette and add a matching cushion or bedsheet to tie the room together." },
      { type: "h2", text: "Relive iconic moments" },
      { type: "p", text: "World Cup wins, final-over finishes and legendary sixes make powerful wall art. A split poster of a famous moment turns it into a panoramic, stadium-style display." },
      { type: "h2", text: "Layout ideas" },
      {
        type: "list",
        items: [
          "Hero wall: one A1 or split poster, nothing else — maximum impact.",
          "Gallery: one A2 centre piece with four A4 posters of team-mates around it.",
          "Study corner: a motivational A3 poster of your hero above your desk.",
        ],
      },
      { type: "cta", text: "Shop cricket posters", href: "/shop/cricket" },
    ],
  },
  {
    slug: "car-posters-for-bedroom",
    title: "Car Posters for Your Bedroom: Supercars, JDM, F1 & Bike Wall Ideas",
    description:
      "Decorate your room with car and bike posters. Ideas for supercar, JDM, F1, Thar and Royal Enfield fans — plus layouts and colour tips for a garage-style wall.",
    date: "2026-11-24",
    readMinutes: 4,
    tags: ["cars", "bikes", "room decor"],
    body: [
      { type: "p", text: "Car posters have been on bedroom walls for decades — and they still make any room feel more personal. Here's how to style them for a modern look." },
      { type: "h2", text: "Choose your lane" },
      {
        type: "list",
        items: [
          "Supercars: Lamborghini, Ferrari, Porsche — sleek and dramatic.",
          "JDM: Supra, Skyline GT-R, RX-7 — neon, street-racing vibes.",
          "F1: race-day action and iconic liveries.",
          "Indian icons: Mahindra Thar, Royal Enfield — rugged and adventurous.",
        ],
      },
      { type: "h2", text: "Create a garage-style wall" },
      { type: "p", text: "Pair car posters with a dark or grey wall, metal shelves and warm Edison-bulb lighting for a workshop feel. Matte posters look great here because they don't reflect the light." },
      { type: "h2", text: "Go wide with split posters" },
      { type: "p", text: "Cars are long and low, which makes them perfect for 3-panel split posters. A side profile stretched across three panels above your bed looks like a showroom display." },
      { type: "h2", text: "Keep it balanced" },
      { type: "p", text: "Stick to one category per wall (all JDM or all F1) and keep the spacing even. Two or three strong posters look better than ten small ones." },
      { type: "cta", text: "Shop car & bike posters", href: "/shop/cars" },
    ],
  },
  {
    slug: "motivational-posters-for-gym-and-study-room",
    title: "Motivational Posters for Your Gym, Study Room or Office",
    description:
      "How to use motivational posters to stay focused — where to place them in a home gym, study room or office, and which styles actually keep you going.",
    date: "2026-11-24",
    readMinutes: 4,
    tags: ["motivational", "gym", "study room"],
    body: [
      { type: "p", text: "What you see every day shapes how you feel. A strong motivational poster in the right spot can be the push you need on days when energy is low." },
      { type: "h2", text: "Home gym" },
      { type: "p", text: "Place one bold poster where you can see it mid-workout — usually the wall facing your bench or mat. Sports legends, boxing art and short, punchy quotes work best. A split poster across a gym wall makes the space feel like a real training room." },
      { type: "h2", text: "Study room" },
      { type: "p", text: "Put a calm but focused poster above your desk, slightly above eye level. Avoid anything too busy — you want inspiration, not distraction. Many students prefer a character or athlete they admire, with a short quote." },
      { type: "h2", text: "Office or work-from-home desk" },
      { type: "p", text: "Keep it clean and minimal: one A3 or A2 poster behind you looks great on video calls and keeps your space feeling professional but personal." },
      { type: "h2", text: "Tips" },
      {
        type: "list",
        items: [
          "One strong message beats many small ones.",
          "Change the poster every few months so it doesn't fade into the background.",
          "Matte prints avoid glare under tube lights and ring lights.",
        ],
      },
      { type: "cta", text: "Explore posters", href: "/shop" },
    ],
  },
  {
    slug: "matte-vs-glossy-posters",
    title: "Matte vs Glossy Posters: Which Paper Finish Is Better?",
    description:
      "Matte or glossy? Compare glare, colour, durability and how each finish looks under room lights — and what 300gsm paper weight means for poster quality.",
    date: "2026-11-24",
    readMinutes: 4,
    tags: ["paper quality", "guide", "posters"],
    body: [
      { type: "p", text: "Two posters with the same artwork can look completely different depending on the paper. Here's what actually matters when you buy." },
      {
        type: "table",
        head: ["", "Matte", "Glossy"],
        rows: [
          ["Glare", "None — readable from any angle", "Reflects lights and windows"],
          ["Colours", "Rich, soft, gallery-like", "Very vivid, high contrast"],
          ["Fingerprints", "Hides them well", "Shows smudges easily"],
          ["Best for", "Bedrooms, RGB setups, bright rooms", "Dim rooms, photo-style prints"],
        ],
      },
      { type: "h2", text: "Why we recommend matte for wall posters" },
      { type: "p", text: "Most rooms have a window, a tube light or LED strips. Glossy paper reflects all of them, so part of the art disappears behind a white glare. Matte paper looks the same from every angle — which is why galleries use it." },
      { type: "h2", text: "What does 300gsm mean?" },
      { type: "p", text: "GSM is grams per square metre — the paper's weight. Typical printer paper is around 70–80gsm. A 300gsm poster is about four times thicker, so it stays flat, resists creases and feels premium in your hands." },
      { type: "h2", text: "How to make a poster last" },
      {
        type: "list",
        items: [
          "Keep it out of direct afternoon sunlight to avoid fading.",
          "Avoid damp walls — moisture makes paper wave.",
          "Use a frame or clip hanger if you plan to move it often.",
        ],
      },
      { type: "cta", text: "Shop 300gsm matte posters", href: "/shop" },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
export const sortedPosts = () => [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
