// lib/sermons-data.ts
// Single source of truth — import from here in both page.tsx and [slug]/page.tsx

export type SeriesTag = "All" | "Faith" | "Family" | "Prayer" | "Identity" | "Prophecy";

export interface Sermon {
  slug: string;
  title: string;
  subtitle: string;
  series: string;
  tag: SeriesTag;
  date: string;
  dateISO: string;
  pastor: string;
  pastorRole: string;
  pastorPhoto: string;
  readTime: string;
  scripture: string;
  excerpt: string;
  body: string;
  featured?: boolean;
}

export const sermons: Sermon[] = [
  {
    slug: "the-god-who-sees-you",
    title: "The God Who Sees You",
    subtitle: "You are never hidden from His gaze.",
    series: "Known & Loved",
    tag: "Identity",
    date: "April 6, 2025",
    dateISO: "2025-04-06",
    pastor: "Pastor James Okafor",
    pastorRole: "Senior Pastor",
    pastorPhoto: "photo-1507003211169-0a1dd7228f2d",
    readTime: "8 min read",
    scripture: "Genesis 16:13",
    excerpt:
      "Hagar was alone in the desert, invisible to the world — yet God found her. This message unpacks what it means to be truly seen by a God who never looks away.",
    body: `There is a woman in the wilderness. She has no status, no tribe, no one to advocate for her. Her name is Hagar, and she has just fled from a home that was never truly hers.\n\nAnd yet, in that desolation, something remarkable happens. God speaks to her. Not to Abraham, the patriarch. Not to Sarah, the matriarch. To Hagar — the one the world had already forgotten.\n\nShe responds with one of the most tender confessions in all of Scripture: *"You are the God who sees me."* El Roi. The God who sees.\n\nWe live in an age of performance. We craft our identities online, we curate what the world sees, and we quietly dread being truly known — because to be known is to be vulnerable. But Hagar's story tells us something the world cannot: the God of the universe already knows you completely, and He has not turned away.\n\nTo be seen by God is not a threat. It is the safest thing there is.\n\nThe question this morning is not whether God sees you. He does. The question is whether you will allow yourself to be found — whether you will stop running and, like Hagar, lift your eyes and receive the grace of being truly known.\n\nYou are not an afterthought in His story. You are the reason He entered the wilderness in the first place.`,
    featured: true,
  },
  {
    slug: "when-faith-feels-like-foolishness",
    title: "When Faith Feels Like Foolishness",
    subtitle: "Trusting God in the season that makes no sense.",
    series: "Rooted",
    tag: "Faith",
    date: "March 30, 2025",
    dateISO: "2025-03-30",
    pastor: "Deaconess Ruth Amadi",
    pastorRole: "Associate Pastor",
    pastorPhoto: "photo-1438032005730-c779502df39b",
    readTime: "6 min read",
    scripture: "Hebrews 11:1",
    excerpt:
      "Faith, by its very nature, requires you to act before the evidence arrives. This message is for everyone who has ever felt foolish for still believing.",
    body: `The writer of Hebrews gives us one of the Bible's most quoted definitions: *"Faith is the substance of things hoped for, the evidence of things not seen."*\n\nNotice what is absent from that definition — certainty. Comfort. Proof.\n\nFaith does not ask you to wait until everything makes sense. It asks you to move before it does. And that, if we are honest, can feel deeply foolish.\n\nNoah built a boat in a desert. Abraham left for a country he'd never seen. Mary said yes to a pregnancy she could not explain. Every one of them had a moment where faith looked, from the outside, like madness.\n\nAnd yet God calls this — this willingness to trust before understanding — the very thing that pleases Him.\n\nI want to speak to someone this morning who is in that in-between place. The promise has been given, but the evidence hasn't arrived. The prayer has been prayed, but the answer hasn't come. And every rational voice around you is saying: give up, move on, be realistic.\n\nDon't.\n\nFaith is not the absence of doubt. It is the decision to trust despite it. And there is nothing foolish about choosing to believe a God who has never once broken His word.`,
    featured: false,
  },
  {
    slug: "the-table-he-prepares",
    title: "The Table He Prepares",
    subtitle: "Grace is not something you earn at the door.",
    series: "Psalms for the Weary",
    tag: "Faith",
    date: "March 23, 2025",
    dateISO: "2025-03-23",
    pastor: "Pastor James Okafor",
    pastorRole: "Senior Pastor",
    pastorPhoto: "photo-1507003211169-0a1dd7228f2d",
    readTime: "7 min read",
    scripture: "Psalm 23:5",
    excerpt:
      "David writes of a table prepared in the presence of enemies. This is not a quiet dinner — it is a declaration. And you have been given a seat.",
    body: `*"You prepare a table before me in the presence of my enemies."*\n\nThis is not the image of a private, peaceful meal. God does not hide you away until the danger passes and then invite you to eat. He sets the table right there — in full view of what threatens you, what accuses you, what has tried to destroy you.\n\nThis is a statement of sovereignty. It says: your enemies do not get to determine where you dine.\n\nThere is someone reading this today who has been made to feel like they must earn their seat. Like grace is rationed. Like you need to clean yourself up before you approach the table.\n\nBut look at who is doing the preparing. Not you. Him. The table is His. The food is His. The invitation is His.\n\nYour only job is to come.\n\nThe enemies in your life — shame, fear, the past, the opinion of others — they may still be in the room. God does not promise to remove them before He feeds you. He promises to feed you anyway. Abundantly. Publicly. Without apology.\n\nCome to the table. You were always meant to be here.`,
    featured: false,
  },
  {
    slug: "praying-with-open-hands",
    title: "Praying with Open Hands",
    subtitle: "What surrender looks like in the prayer room.",
    series: "The Posture of Prayer",
    tag: "Prayer",
    date: "March 16, 2025",
    dateISO: "2025-03-16",
    pastor: "Deacon Philip Eze",
    pastorRole: "Minister of Prayer",
    pastorPhoto: "photo-1543968996-ee822b8176ba",
    readTime: "5 min read",
    scripture: "Matthew 6:10",
    excerpt:
      "We often approach God with a list of demands held tight in our fists. This message invites you to open your hands — and discover what He places in them.",
    body: `*"Your kingdom come, your will be done."*\n\nJesus taught us to pray these words — and they are among the most radical in Scripture. They are a surrender. A laying down of our agenda in favour of His.\n\nMost of us come to prayer with clenched fists. We know what we want. We know what we need. And we present our case to God with the urgency of someone who has already decided the outcome.\n\nThere is nothing wrong with bringing your desires to God — in fact, He invites it. But there is something He wants more than your requests. He wants your trust.\n\nOpen-handed prayer is not weak prayer. It is the most courageous kind. It says: I believe you are good enough that I can release the outcome to you. I believe your will is not something to be feared but something to be welcomed.\n\nI want to challenge you today. Before you bring your list, try something different. Sit before Him in silence. Open your hands — literally, physically open them. And say: whatever you want to place here, I receive. Whatever you want to remove, I release.\n\nThat posture changes everything. Not because it changes God, but because it changes us.`,
    featured: false,
  },
  {
    slug: "a-house-built-on-prayer",
    title: "A House Built on Prayer",
    subtitle: "The family that prays together stays together — here's why.",
    series: "Family",
    tag: "Family",
    date: "March 9, 2025",
    dateISO: "2025-03-09",
    pastor: "Pastor & Mrs. Nwosu",
    pastorRole: "Family Life Pastors",
    pastorPhoto: "photo-1502672260266-1c1ef2d93688",
    readTime: "9 min read",
    scripture: "Joshua 24:15",
    excerpt:
      "Joshua's declaration — 'As for me and my house, we will serve the Lord' — was not a passive hope. It was a decision. And every family must make it.",
    body: `Joshua has seen it all. He stood at the edge of the Jordan. He watched the walls of Jericho fall. He has buried friends and outlasted a generation.\n\nAnd now, at the end of his life, he gathers Israel and says: choose.\n\n*"As for me and my house, we will serve the Lord."*\n\nNotice that he doesn't say he hopes his household will. He doesn't say he's praying they will. He says they will. This is the language of a man who has led his family — not just in words, but in practice.\n\nThe family that prays together is not guaranteed a life without pain. But they are given something more valuable: a shared language for navigating it. When the crisis comes — and it will come — they already know where to turn.\n\nPrayer in the home is not a religious ritual. It is a declaration. It says: in this house, we believe there is a God worth talking to. We believe He is listening. We believe He acts.\n\nIf you are a parent, you are already a theologian to your children. The question is what theology you are teaching them — by what you rush toward in the morning, by what you reach for in the night.\n\nMay our homes be places where the next generation learns, by watching us, that God is worth trusting.`,
    featured: false,
  },
  {
    slug: "your-identity-before-your-assignment",
    title: "Your Identity Before Your Assignment",
    subtitle: "Who you are must come before what you do.",
    series: "Known & Loved",
    tag: "Identity",
    date: "March 2, 2025",
    dateISO: "2025-03-02",
    pastor: "Deaconess Ruth Amadi",
    pastorRole: "Associate Pastor",
    pastorPhoto: "photo-1438032005730-c779502df39b",
    readTime: "7 min read",
    scripture: "Matthew 3:17",
    excerpt:
      "Before Jesus performed a single miracle, before He preached a single sermon, the Father declared: 'This is my beloved Son, in whom I am well pleased.' Identity precedes assignment.",
    body: `Jesus had not yet healed anyone. He had not yet turned water into wine. He had not yet taught the Sermon on the Mount.\n\nHe had simply come to be baptised. And the Father spoke.\n\n*"This is my beloved Son, in whom I am well pleased."*\n\nThe pleasure of the Father was not contingent on the performance of the Son. It was declared before the ministry began.\n\nWe live in a culture that defines us by what we produce. Your value, it tells us, is a function of your output — your title, your achievements, your visibility. And the church is not immune. We celebrate the minister who builds the biggest platform, the worker who volunteers the most hours.\n\nBut the Father's declaration to Jesus unmasks this lie.\n\nYou are not loved because of what you do. You are loved because of who you are — His. And that identity, settled before the first miracle, is what gives you the freedom to serve without striving, to lead without fear, to lay down what you've built without losing yourself.\n\nIf your identity is built on your assignment, your assignment will eventually bury you. But if your identity is rooted in His love — that cannot be taken. That cannot be lost. That holds even when the platform disappears.\n\nBefore you do one more thing for God today — receive this: you are already His beloved. That is enough. That was always enough.`,
    featured: true,
  },
];

// ─── UI helpers ───────────────────────────────────────────────────────────────

export const seriesTags: SeriesTag[] = ["All", "Faith", "Family", "Prayer", "Identity", "Prophecy"];

export const tagColors: Record<SeriesTag, string> = {
  All:      "bg-white/15 text-white",
  Faith:    "bg-amber-500/20 text-amber-200",
  Family:   "bg-teal-500/20 text-teal-200",
  Prayer:   "bg-sky-500/20 text-sky-200",
  Identity: "bg-violet-500/20 text-violet-200",
  Prophecy: "bg-rose-500/20 text-rose-200",
};

export const tagActiveBg: Record<SeriesTag, string> = {
  All:      "bg-white text-black",
  Faith:    "bg-amber-400 text-amber-950",
  Family:   "bg-teal-400 text-teal-950",
  Prayer:   "bg-sky-400 text-sky-950",
  Identity: "bg-violet-400 text-violet-950",
  Prophecy: "bg-rose-400 text-rose-950",
};
