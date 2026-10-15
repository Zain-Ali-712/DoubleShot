// All content below is sourced from doubleshot.com.pk and @doubleshotlhr.
// See scraped-data.md for the source of each item.

export type Category = "coffee" | "beans" | "merch";

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  blurb: string;
  note?: string;
  /** Background-removed version of the official photo, when we have one. */
  cutout?: string;
  inStock: boolean;
};

// Stock is placeholder until the backend connects. On 15 Oct 2026 the live
// store listed every item as out of stock; two are marked out here so the
// label and disabled state can be reviewed.

export const products: Product[] = [
  {
    slug: "cans",
    name: "Cans",
    price: 950,
    cutout: "/img/hero-can.png",
    inStock: true,
    category: "coffee",
    image: "/img/can.jpg",
    blurb: "Made for easy, everyday enjoyment. Our Spanish Latte, sealed and ready to go.",
  },
  {
    slug: "cold-brew",
    name: "Cold Brew",
    price: 1100,
    cutout: "/img/hero-coldbrew.png",
    inStock: true,
    category: "coffee",
    image: "/img/coldbrew.jpg",
    blurb: "Slow-steeped to come out smooth and well-rounded.",
    note: "Pickup only",
  },
  {
    slug: "brazil-cerrado-beans",
    name: "Brazil Cerrado Beans",
    price: 4000,
    cutout: "/img/cut-beans-set.png",
    inStock: true,
    category: "beans",
    image: "/img/beans.jpg",
    blurb: "Medium roast, natural process. Low acidity and full body, with milk chocolate, hazelnut and pecan.",
  },
  {
    slug: "yoocha-matcha",
    name: "Yoocha Matcha",
    price: 5500,
    cutout: "/img/cut-matcha.png",
    inStock: true,
    category: "beans",
    image: "/img/matcha.png",
    blurb: "High-grown premium Japanese matcha powder, smooth and pure.",
  },
  {
    slug: "tumbler",
    name: "Tumbler",
    price: 5000,
    cutout: "/img/cut-tumbler.png",
    inStock: true,
    category: "merch",
    image: "/img/tumbler.jpg",
    blurb: "Stainless steel. Keeps cold drinks cool and hot drinks warm.",
  },
  {
    slug: "denim-cap",
    name: "Denim Cap",
    price: 2500,
    cutout: "/img/cut-cap.png",
    inStock: false,
    category: "merch",
    image: "/img/cap.jpg",
    blurb: "Tailor-made denim cap, made in collab with @roseofficial.co.",
  },
  {
    slug: "gift-shot",
    name: "Gift Shot",
    price: 2500,
    inStock: true,
    category: "merch",
    image: "/img/giftshot.jpg",
    blurb: "A reloadable card for coffee lovers, or a thoughtful DS gift.",
  },
  {
    slug: "gift-basket",
    name: "Gift Basket",
    price: 2500,
    cutout: "/img/cut-giftbasket.png",
    inStock: false,
    category: "merch",
    image: "/img/giftbasket.jpg",
    blurb: "A thoughtfully curated gift for the coffee lover in your life.",
  },
];

export const categories: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "coffee", label: "Ready to drink" },
  { id: "beans", label: "Beans & matcha" },
  { id: "merch", label: "Merch & gifts" },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export type HeroSlide = {
  slug: string;
  name: string;
  line: string;
  image: string;
  spill: string;
  accent: string;
};

export const heroSlides: HeroSlide[] = [
  {
    slug: "cans",
    name: "Spanish Latte Can",
    line: "Our go-to latte, sealed for wherever the day takes you.",
    image: "/img/hero-can.png",
    spill: "#b5d6c9",
    accent: "#e2efe9",
  },
  {
    slug: "yoocha-matcha",
    name: "Yoocha Matcha",
    line: "High-grown Japanese matcha. Whisk it at home, or let us pour it over ice.",
    image: "/img/cut-matcha.png",
    spill: "#c7dcae",
    accent: "#edf3e4",
  },
  {
    slug: "brazil-cerrado-beans",
    name: "Brazil Cerrado",
    line: "New season roast. Milk chocolate, hazelnut and pecan.",
    image: "/img/hero-beans.png",
    spill: "#ecd6b8",
    accent: "#f6ece0",
  },
];

export type Branch = { name: string; area: string; map: string; lat: number; lng: number; note?: string };

// Coordinates come from each branch's official Google Maps link on
// doubleshot.com.pk/page/our-locations. Mall Road is verified on Google Maps.
export const branches: Branch[] = [
  { name: "DHA Phase 6", area: "Where it all started, May 2023", map: "https://maps.app.goo.gl/FvwGkGLNersJy3Jx7", lat: 31.4754734, lng: 74.4455653 },
  { name: "Cantt", area: "Bagh Ali Road", map: "https://maps.app.goo.gl/cHb5PYiKSzvLSYuN9", lat: 31.5210747, lng: 74.3802394 },
  { name: "Gulberg", area: "Main Boulevard", map: "https://maps.app.goo.gl/AebQqcMUJLne3jpy7", lat: 31.5138723, lng: 74.3430872 },
  { name: "Model Town", area: "Bank Square", map: "https://maps.app.goo.gl/MyTzzzHw2JA1WUSz6", lat: 31.4890659, lng: 74.326105 },
  { name: "Pine Avenue", area: "Vertical II", map: "https://maps.app.goo.gl/jujDvQj7Q9UndbBbA", lat: 31.3743981, lng: 74.2567065 },
  { name: "Bahria Town", area: "Sector C", map: "https://maps.app.goo.gl/73KuKh2NTXjMKe8L9", lat: 31.3746531, lng: 74.1856297 },
  { name: "Dolmen Mall", area: "DHA, Lahore", map: "https://maps.app.goo.gl/K7MZrp38jydMDuHz7", lat: 31.4672209, lng: 74.4348381 },
  {
    name: "Mall Road",
    area: "Shahrah-e-Quaid-e-Azam, Mozang Chungi",
    map: "https://www.google.com/maps/search/?api=1&query=Double%20Shot%20Mall%20Road&query_place_id=ChIJHax0cyAbGTkRnknk2NlNVMk",
    lat: 31.5619455,
    lng: 74.318525,
    note: "Opened September 2026",
  },
];

export const milestones = [
  { when: "May 2023", what: "We open in DHA Phase 6: 350 sq ft, four tables, doors open at 6 am, seven days a week. A cult following within a month." },
  { when: "May 17, 2024", what: "On our first anniversary, the second branch opens its doors." },
  { when: "October 2024", what: "Pakistan's first specialty coffee Drive-Thru, among the first of its kind anywhere." },
  { when: "July 2025", what: "Six flagship locations across Lahore, each serving 1000+ customers a day." },
  { when: "September 2026", what: "Mall Road joins the family, right among the city's oldest streets." },
];

export const rickshot = {
  setupFee: 15000,
  packages: [
    { drinks: 50, price: 60000, extra: 850 },
    { drinks: 80, price: 80000, extra: 800 },
    { drinks: 100, price: 95000, extra: 750, popular: true },
    { drinks: 150, price: 130000, extra: 700 },
  ],
  menu: [
    { name: "Cappuccino", temp: "Hot" },
    { name: "Latte", temp: "Hot or iced" },
    { name: "Hazelnut Latte", temp: "Hot or iced" },
    { name: "Vanilla Latte", temp: "Hot or iced" },
    { name: "Spanish Latte", temp: "Hot or iced" },
    { name: "Chocolate Classic", temp: "Hot or iced" },
  ],
  terms: [
    { title: "Booking", text: "100% advance payment secures your date." },
    { title: "Power", text: "We inspect the electricity supply before the event." },
    { title: "Travel", text: "PKR 5,000 for venues more than 20 km from DHA Phase VI." },
    { title: "Team", text: "Our baristas stay for 4 hours from setup." },
  ],
  bookingForm: "https://forms.gle/YpgG7KCCUV7khvMaA",
};

export const contact = {
  whatsapp: "923229115222",
  whatsappDisplay: "+92 322 9115222",
  instagram: "https://www.instagram.com/doubleshotlhr/",
  facebook: "https://www.facebook.com/doubleshotlhr/",
};

export const formatPKR = (n: number) => `PKR ${n.toLocaleString("en-PK")}`;
