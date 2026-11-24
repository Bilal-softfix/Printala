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
  {
    slug: "south-indian-movie-posters-room-decor",
    title: "South Indian Movie Posters: Room Decor Ideas for Tamil, Telugu, Kannada & Malayalam Cinema Fans",
    description:
      "Turn your wall into a tribute to South Indian cinema. Poster layouts, colour ideas and fan-wall tips for Kollywood, Tollywood, Sandalwood and Mollywood fans.",
    date: "2026-11-24",
    readMinutes: 6,
    tags: ["south india", "movie posters", "room decor"],
    body: [
      { type: "p", text: "South Indian cinema has some of the most passionate fans in the world — first-day-first-show crowds, cut-outs, whistles and all. Bringing that energy home is easy with the right posters. Here's how to build a wall that celebrates Kollywood, Tollywood, Sandalwood or Mollywood in style." },
      { type: "h2", text: "Pick your industry — or mix them" },
      {
        type: "list",
        items: [
          "Tamil (Kollywood): mass-hero moments and iconic dialogues.",
          "Telugu (Tollywood): larger-than-life epics and blockbuster action.",
          "Kannada (Sandalwood): gritty, stylish visuals made famous worldwide by KGF and Kantara.",
          "Malayalam (Mollywood): realistic, aesthetic frames — perfect for a calmer room.",
        ],
      },
      { type: "p", text: "Pan-India fans can mix all four — keep one colour palette (for example dark tones with gold) so the wall still looks planned." },
      { type: "h2", text: "Build a 'first day first show' fan wall" },
      { type: "p", text: "Put your favourite hero's poster in the centre at eye level, in A2 or as a 3-panel split poster. Surround it with A4 or A3 posters of their best films, spaced evenly about 5 cm apart. It recreates that theatre-entrance feeling right in your room." },
      { type: "h2", text: "Use split posters for epic scenes" },
      { type: "p", text: "Wide, cinematic frames — battle scenes, entry shots, slow-motion walks — look incredible as split posters. Stretched across three panels above your bed or TV, they feel like a cinema screen." },
      { type: "h2", text: "Colour and lighting tips" },
      {
        type: "list",
        items: [
          "Dark, high-contrast action posters pop under cool white or RGB lights.",
          "Warm, golden-toned art suits wooden furniture and traditional homes.",
          "Matte paper avoids glare from windows and tube lights — important in bright South Indian homes.",
        ],
      },
      { type: "cta", text: "Shop movie posters", href: "/shop/bollywood" },
    ],
  },
  {
    slug: "tamil-cinema-fan-wall-thalaivar-thalapathy",
    title: "Thalaivar & Thalapathy Fan Wall: Tamil Cinema Poster Ideas",
    description:
      "Ideas for a Tamil cinema fan wall — styling Rajinikanth, Vijay, Ajith and Suriya posters, dialogue art, and layouts for bedrooms, hostels and home theatres.",
    date: "2026-11-24",
    readMinutes: 5,
    tags: ["south india", "tamil", "movie posters"],
    body: [
      { type: "p", text: "In Tamil Nadu, a star's release is a festival. If your loyalty is to Thalaivar, Thalapathy, Thala or Suriya, your room should show it. Here's how to make a fan wall that looks premium, not cluttered." },
      { type: "h2", text: "One hero, one statement" },
      { type: "p", text: "The strongest fan walls focus on one star. Choose a single large poster — A1 or a 3-panel split poster — with their most iconic look or entry scene. Leave space around it; let it breathe like a theatre banner." },
      { type: "h2", text: "Add dialogue art" },
      { type: "p", text: "Tamil cinema is famous for punch dialogues. Smaller A4 or A3 posters with typography-style dialogues placed next to the main poster add personality and make guests smile." },
      { type: "h2", text: "Home theatre corner" },
      { type: "p", text: "If you have a TV wall or projector setup, frame it with two vertical posters on either side. Dim warm lights behind the TV make matte posters glow without reflections — just like a cinema hall." },
      { type: "h2", text: "Hostel room version" },
      {
        type: "list",
        items: [
          "Use A3 posters — big enough to notice, easy to carry home after semester.",
          "Stick them with removable strips so you don't lose your hostel deposit.",
          "Theme it: one wall for your favourite hero, one for cricket — very Chennai.",
        ],
      },
      { type: "cta", text: "Browse movie posters", href: "/shop/bollywood" },
    ],
  },
  {
    slug: "telugu-movie-posters-tollywood-fans",
    title: "Telugu Movie Posters: Mass Hero Wall Ideas for Tollywood Fans",
    description:
      "Pushpa, Baahubali, RRR and mass-hero moments — ideas for decorating your room with Telugu cinema posters, from split-poster epics to gallery walls.",
    date: "2026-11-24",
    readMinutes: 5,
    tags: ["south india", "telugu", "movie posters"],
    body: [
      { type: "p", text: "Tollywood does scale like no one else — epic battles, unforgettable entry scenes and dialogues the whole state repeats. Those visuals are made for big walls." },
      { type: "h2", text: "Epic films deserve split posters" },
      { type: "p", text: "Films like Baahubali and RRR are built on huge, wide frames. A 3-panel or 5-panel split poster recreates that scale above a bed, sofa or study desk — far more impressive than a single small print." },
      { type: "h2", text: "Mass-hero gallery wall" },
      {
        type: "list",
        items: [
          "Centre: your favourite star's most iconic look in A2.",
          "Sides: two A3 posters from their biggest hits.",
          "Bottom row: small A4 dialogue or symbol posters — the 'thaggedhe le' energy.",
        ],
      },
      { type: "h2", text: "Match the room's colours" },
      { type: "p", text: "Pushpa-style earthy reds and browns suit wooden furniture; Baahubali's golds and blues look grand with warm lighting; RRR's fire-and-water contrast works brilliantly on a white or grey wall." },
      { type: "h2", text: "Gift idea" },
      { type: "p", text: "For a friend in Hyderabad, Vijayawada or Vizag who never misses a first-day show, a poster of their favourite hero is a gift they'll actually hang — and talk about." },
      { type: "cta", text: "Shop movie posters", href: "/shop/bollywood" },
    ],
  },
  {
    slug: "kannada-cinema-posters-kgf-kantara",
    title: "Kannada Cinema Wall Art: KGF, Kantara & Sandalwood Poster Ideas",
    description:
      "Sandalwood went pan-India with KGF and Kantara. Ideas for styling Kannada cinema posters in Bengaluru flats, PGs and gaming rooms.",
    date: "2026-11-24",
    readMinutes: 4,
    tags: ["south india", "kannada", "movie posters"],
    body: [
      { type: "p", text: "KGF and Kantara put Kannada cinema on every screen in India. Their dark, dramatic visuals make some of the most striking wall art you can hang." },
      { type: "h2", text: "Go dark and dramatic" },
      { type: "p", text: "KGF's smoky golds and deep blacks look best on a dark or grey wall with warm lighting. A single A1 poster or a wide split poster becomes an instant focal point — perfect for a gaming room or a bachelor flat in Bengaluru." },
      { type: "h2", text: "Earthy, cultural tones" },
      { type: "p", text: "Kantara's fiery reds and earthy textures suit homes with wooden furniture, plants and traditional decor. Pair the poster with brass lamps or warm fairy lights for a rich, cultural look." },
      { type: "h2", text: "Small-space tips for Bengaluru PGs" },
      {
        type: "list",
        items: [
          "Use one A2 poster above your bed rather than many small ones — small rooms look bigger with fewer, larger pieces.",
          "Use removable strips; most PG owners don't allow nails.",
          "Bengaluru's mild weather is kind to paper — matte posters stay flat and fresh for years.",
        ],
      },
      { type: "cta", text: "Shop movie posters", href: "/shop/bollywood" },
    ],
  },
  {
    slug: "malayalam-cinema-aesthetic-posters",
    title: "Malayalam Cinema Aesthetic Posters: Calm, Classy Room Decor",
    description:
      "Mollywood's realistic, beautifully shot films make perfect aesthetic wall art. Ideas for Malayalam cinema posters in Kochi, Thiruvananthapuram and beyond.",
    date: "2026-11-24",
    readMinutes: 4,
    tags: ["south india", "malayalam", "aesthetic"],
    body: [
      { type: "p", text: "Malayalam cinema is loved for its realism, natural light and beautiful frames — from Lalettan and Mammukka classics to new-wave hits. That softer, cinematic look makes for elegant room decor." },
      { type: "h2", text: "Aesthetic over loud" },
      { type: "p", text: "Choose posters with natural colours — greens, blues and warm sunset tones. They suit Kerala homes with lots of daylight and pair well with plants, wooden shelves and minimal furniture." },
      { type: "h2", text: "Gallery of frames" },
      { type: "p", text: "Malayalam films have many iconic stills rather than one big image. Create a gallery wall of four to six A4 posters in a neat grid — it feels like a film festival lobby." },
      { type: "h2", text: "Kerala climate tip" },
      { type: "p", text: "Coastal humidity can make paper wave over time. Keep posters away from bathroom walls and damp corners, and consider a frame or clip hanger during the monsoon. Matte 300gsm paper holds up much better than thin glossy prints." },
      { type: "cta", text: "Browse posters", href: "/shop" },
    ],
  },
  {
    slug: "ipl-fan-room-decor-csk-rcb-srh",
    title: "IPL Fan Room Decor for South India: CSK, RCB & SRH Wall Ideas",
    description:
      "Whistle Podu, Ee Sala Cup Namde, Orange Army — room decor ideas for Chennai Super Kings, Royal Challengers Bengaluru and Sunrisers Hyderabad fans.",
    date: "2026-11-24",
    readMinutes: 5,
    tags: ["south india", "cricket", "ipl"],
    body: [
      { type: "p", text: "The South has three of the IPL's loudest fan bases. Your team colours deserve more than a jersey in the cupboard — put them on the wall." },
      { type: "h2", text: "CSK: the Yellove wall" },
      { type: "p", text: "Go full yellow: a large poster of Thala Dhoni in the centre, flanked by smaller posters of legends and match-winning moments. Add a yellow cushion or bedsheet and the room is ready for Whistle Podu nights." },
      { type: "h2", text: "RCB: red and gold" },
      { type: "p", text: "RCB fans waited a long time for that first title — celebrate it. Red-and-black posters of Virat Kohli and big-night moments work beautifully with gold accents and warm lighting. Ee Sala Cup Namde, on your wall." },
      { type: "h2", text: "SRH: the Orange Army corner" },
      { type: "p", text: "Orange is bold, so balance it: one strong poster on a white or grey wall, with black frames or shelves around it. Perfect for a Hyderabad flat or hostel room." },
      { type: "h2", text: "Layouts that work for any team" },
      {
        type: "list",
        items: [
          "Match-day wall: one split poster of a stadium or celebration moment above the TV.",
          "Player gallery: one A2 captain poster plus three A4 team-mate posters in a row.",
          "Study desk: a motivational A3 poster of your favourite player — focus mode on.",
        ],
      },
      { type: "cta", text: "Shop cricket posters", href: "/shop/cricket" },
    ],
  },
  {
    slug: "poster-care-humid-cities-chennai-kochi",
    title: "Poster Care in Humid Cities: Chennai, Kochi, Mangaluru & Vizag",
    description:
      "Coastal humidity can curl and wave paper posters. Simple tips to keep posters flat and fresh in Chennai, Kochi, Mangaluru, Vizag and other humid South Indian cities.",
    date: "2026-11-24",
    readMinutes: 4,
    tags: ["south india", "poster care", "how to"],
    body: [
      { type: "p", text: "Sea breeze, monsoon rains and sticky summers — coastal South India is tough on paper. With a few habits, your posters will stay flat and vibrant for years." },
      { type: "h2", text: "1. Choose thick, matte paper" },
      { type: "p", text: "Thin paper absorbs moisture quickly and starts to wave. Heavier 300gsm matte paper is far more stable and doesn't show the shine of damp patches like glossy prints do." },
      { type: "h2", text: "2. Pick the right wall" },
      {
        type: "list",
        items: [
          "Avoid walls shared with bathrooms or kitchens.",
          "Skip walls that feel cool or damp to touch in the monsoon.",
          "Interior walls stay drier than walls facing the sea or rain.",
        ],
      },
      { type: "h2", text: "3. Use stronger mounting" },
      { type: "p", text: "Humidity weakens putty and some tapes. Use good-quality removable adhesive strips on all four corners, or hang the poster in a clip frame so it isn't stuck to the wall at all." },
      { type: "h2", text: "4. Let air circulate" },
      { type: "p", text: "A ceiling fan or occasional AC keeps humidity down. During heavy monsoon weeks, open windows on dry afternoons to air out the room." },
      { type: "h2", text: "5. Fixing a wavy poster" },
      { type: "p", text: "Take it down, lay it flat under a few heavy books in an air-conditioned room overnight, and re-hang it with fresh strips." },
      { type: "cta", text: "Shop 300gsm matte posters", href: "/shop" },
    ],
  },
  {
    slug: "bengaluru-pg-flat-room-decor-posters",
    title: "Bengaluru PG & Flat Room Decor: Poster Ideas on a Budget",
    description:
      "Moved to Bengaluru for work or college? Budget-friendly poster decor ideas for PG rooms, shared flats and work-from-home corners — no nails, no deposit drama.",
    date: "2026-11-24",
    readMinutes: 5,
    tags: ["south india", "bengaluru", "room decor"],
    body: [
      { type: "p", text: "Thousands of people move to Bengaluru every month for tech jobs and college. A PG room or shared flat can feel like home quickly — posters are the cheapest, fastest way to do it." },
      { type: "h2", text: "PG room: one wall, one story" },
      { type: "p", text: "Most PG rooms are small. Pick the wall behind your bed and keep it to one theme — anime, cars, cricket or cinema. One A2 poster with two A4s beside it is enough to change the whole feel." },
      { type: "h2", text: "Work-from-home corner" },
      { type: "p", text: "The wall behind your laptop shows up on every stand-up call. A clean A3 or A2 poster — minimal, aesthetic or motivational — looks professional and personal at the same time." },
      { type: "h2", text: "Shared flat living room" },
      { type: "p", text: "Agree on a theme with flatmates, then go big: a 3-panel split poster above the sofa gives the room a finished look for less than the cost of a weekend dinner out." },
      { type: "h2", text: "Rules to protect your deposit" },
      {
        type: "list",
        items: [
          "Never use nails or strong double-sided tape on painted walls.",
          "Use removable strips or poster putty, and peel slowly when moving out.",
          "Keep posters rolled in their tube when shifting PGs — they travel easily.",
        ],
      },
      { type: "p", text: "Ordering under budget? Orders above ₹499 ship free, and Cash on Delivery is available — handy when you've just moved in." },
      { type: "cta", text: "Find posters for your room", href: "/shop" },
    ],
  },
  {
    slug: "hyderabad-room-decor-posters",
    title: "Hyderabad Room Decor Ideas: Posters for Hostels, Flats & Gaming Rooms",
    description:
      "From Gachibowli flats to college hostels — poster decor ideas for Hyderabad rooms, plus tips to protect posters from harsh summer sun.",
    date: "2026-11-24",
    readMinutes: 4,
    tags: ["south india", "hyderabad", "room decor"],
    body: [
      { type: "p", text: "Hyderabad mixes IT-corridor flats, busy college hostels and a huge gaming and cinema culture. Here's how to decorate each with posters." },
      { type: "h2", text: "IT flat: minimal and modern" },
      { type: "p", text: "Pick one or two large posters with a consistent colour palette — car art, aesthetic anime or motivational designs — and keep the rest of the wall clean." },
      { type: "h2", text: "College hostel: fandom wall" },
      { type: "p", text: "Tollywood heroes, SRH and anime are hostel favourites. Use A3 posters with removable strips so they come down easily at the end of the year." },
      { type: "h2", text: "Gaming room" },
      { type: "p", text: "A wide split poster above your desk plus RGB strips behind the monitor makes any room stream-ready. Matte paper avoids glare from screens and lights." },
      { type: "h2", text: "Beat the summer sun" },
      {
        type: "list",
        items: [
          "Hyderabad summers are intense — avoid walls in direct afternoon sunlight to prevent fading.",
          "Use curtains or blinds on west-facing windows.",
          "Rotate posters between walls once a year if one wall gets more sun.",
        ],
      },
      { type: "cta", text: "Shop posters", href: "/shop" },
    ],
  },
  {
    slug: "onam-pongal-ugadi-room-makeover-poster-ideas",
    title: "Onam, Pongal & Ugadi Room Makeover: Festive Poster Decor Ideas",
    description:
      "Refresh your room for South Indian festivals. Easy poster makeover ideas and gift picks for Onam, Pongal, Ugadi and Vishu.",
    date: "2026-11-24",
    readMinutes: 4,
    tags: ["south india", "festivals", "gift ideas"],
    body: [
      { type: "p", text: "Festivals are when homes get cleaned, painted and refreshed — the perfect time to change what's on your walls, or to gift something personal." },
      { type: "h2", text: "Pongal (Tamil Nadu)" },
      { type: "p", text: "After the Bhogi clean-up, a fresh wall feels right. Replace old prints with a new poster in warm harvest colours — yellows, oranges and greens — or treat yourself to the cricket or cinema poster you've been eyeing." },
      { type: "h2", text: "Onam (Kerala)" },
      { type: "p", text: "Families gather and rooms fill with guests. A calm, aesthetic poster or a gallery wall of small prints makes the living room feel festive without clutter." },
      { type: "h2", text: "Ugadi (Karnataka, Andhra Pradesh, Telangana)" },
      { type: "p", text: "A new year deserves a new look. Swap in a motivational poster for your study or work desk to start the year focused." },
      { type: "h2", text: "Festival gift ideas" },
      {
        type: "list",
        items: [
          "Siblings: a poster of their favourite hero, team or anime character.",
          "Students: a motivational A3 poster for their study table.",
          "New homeowners: a split poster for their living room.",
        ],
      },
      { type: "p", text: "Tip: order a little early — festival weeks are busy for couriers everywhere." },
      { type: "cta", text: "Browse all posters", href: "/shop" },
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
export const sortedPosts = () => [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

export const tagSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
/** Tags used by 2+ posts get their own hub page at /blog/tag/<slug>. */
export const blogTags = () => {
  const counts = new Map<string, number>();
  POSTS.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
  return [...counts.entries()]
    .filter(([, n]) => n >= 2)
    .map(([name, count]) => ({ name, slug: tagSlug(name), count }))
    .sort((a, b) => b.count - a.count);
};
