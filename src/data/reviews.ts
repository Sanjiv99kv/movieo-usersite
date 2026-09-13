/**
 * Audience and critic reviews. The sentiment chips summarise the full review count the
 * way a real listing does, while the cards below show a sample — that is why the chip
 * totals are far larger than the number of reviews rendered.
 */
export type Review = {
  id: string;
  author: string;
  score: number;
  tags: string[];
  text: string;
  helpful: number;
  daysAgo: number;
};

export type CriticReview = {
  id: string;
  outlet: string;
  score: number;
  verdict: string;
};

export type Sentiment = { tag: string; count: number };

type MovieReviews = {
  sentiment: Sentiment[];
  reviews: Review[];
  critics: CriticReview[];
};

const REVIEWS: Record<string, MovieReviews> = {
  "echoes-of-arrakis": {
    sentiment: [
      { tag: "VisualSpectacle", count: 412 },
      { tag: "GreatActing", count: 361 },
      { tag: "SuperDirection", count: 298 },
      { tag: "WowMusic", count: 254 },
      { tag: "SlowStart", count: 88 },
    ],
    reviews: [
      {
        id: "eoa-1",
        author: "Rhea Kapoor",
        score: 10,
        tags: ["VisualSpectacle", "WowMusic"],
        text: "Saw it in IMAX and the desert sequences genuinely made the room feel bigger. The score does half the storytelling.",
        helpful: 842,
        daysAgo: 2,
      },
      {
        id: "eoa-2",
        author: "Imran S.",
        score: 9,
        tags: ["GreatActing", "SuperDirection"],
        text: "Marenko carries the whole second half without raising his voice once. Worth the ticket for that alone.",
        helpful: 316,
        daysAgo: 4,
      },
      {
        id: "eoa-3",
        author: "Devika N.",
        score: 7,
        tags: ["SlowStart"],
        text: "Takes forty minutes to get going and I nearly gave up. Glad I didn't, but the first act needed a trim.",
        helpful: 129,
        daysAgo: 6,
      },
    ],
    critics: [
      {
        id: "eoa-c1",
        outlet: "The Reel Review",
        score: 9,
        verdict:
          "A rare blockbuster that trusts silence. Aurel has made the year's most confident film.",
      },
      {
        id: "eoa-c2",
        outlet: "Screen Daily India",
        score: 8,
        verdict: "Overlong by a reel, but the craft on display is close to unmatched.",
      },
    ],
  },
  "crimson-run": {
    sentiment: [
      { tag: "EdgeOfSeat", count: 288 },
      { tag: "GreatActing", count: 201 },
      { tag: "StunningVisuals", count: 174 },
      { tag: "PredictableEnd", count: 62 },
    ],
    reviews: [
      {
        id: "cr-1",
        author: "Anish Verma",
        score: 9,
        tags: ["EdgeOfSeat"],
        text: "Ninety minutes of pure momentum. I forgot I was holding my drink.",
        helpful: 455,
        daysAgo: 1,
      },
      {
        id: "cr-2",
        author: "Farida M.",
        score: 8,
        tags: ["GreatActing", "StunningVisuals"],
        text: "Nandakumar is superb and the city looks incredible in the rain. Ending is a bit neat.",
        helpful: 208,
        daysAgo: 3,
      },
      {
        id: "cr-3",
        author: "Karan T.",
        score: 6,
        tags: ["PredictableEnd"],
        text: "Great ride, but I called the twist in the first twenty minutes.",
        helpful: 74,
        daysAgo: 5,
      },
    ],
    critics: [
      {
        id: "cr-c1",
        outlet: "Night Screen",
        score: 8,
        verdict: "Sood directs a chase picture with real teeth, even when the plot plays it safe.",
      },
      {
        id: "cr-c2",
        outlet: "The Reel Review",
        score: 7,
        verdict: "Style to burn. A sharper final act would have made it a classic.",
      },
    ],
  },
  "moonlight-tales": {
    sentiment: [
      { tag: "FamilyFavourite", count: 334 },
      { tag: "BeautifulAnimation", count: 287 },
      { tag: "MadeMeCry", count: 196 },
      { tag: "WowMusic", count: 143 },
    ],
    reviews: [
      {
        id: "mt-1",
        author: "Sneha R.",
        score: 10,
        tags: ["FamilyFavourite", "MadeMeCry"],
        text: "Took my seven-year-old and ended up the one crying. The lantern scene is something else.",
        helpful: 621,
        daysAgo: 2,
      },
      {
        id: "mt-2",
        author: "Vikas P.",
        score: 9,
        tags: ["BeautifulAnimation"],
        text: "Every frame looks hand-painted. Genuinely the best-looking animation I've seen this year.",
        helpful: 287,
        daysAgo: 5,
      },
      {
        id: "mt-3",
        author: "Leena D.",
        score: 8,
        tags: ["WowMusic"],
        text: "Soundtrack has been in my head for three days. Kids loved it too.",
        helpful: 112,
        daysAgo: 8,
      },
    ],
    critics: [
      {
        id: "mt-c1",
        outlet: "Screen Daily India",
        score: 9,
        verdict: "Zhao's forest is a wonder — a children's film with no interest in talking down.",
      },
      {
        id: "mt-c2",
        outlet: "Family Film Weekly",
        score: 9,
        verdict: "The rare animation that earns its tears honestly.",
      },
    ],
  },
};

/** Titles without hand-written reviews simply show none, rather than inventing them. */
export function getReviews(movieId: string): MovieReviews | undefined {
  return REVIEWS[movieId];
}

export function relativeDays(days: number): string {
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.round(days / 7);
  return weeks === 1 ? "A week ago" : `${weeks} weeks ago`;
}

export function compactCount(value: number): string {
  return value >= 1000 ? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(value);
}
