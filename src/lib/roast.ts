// Roast copy system — savage lines per category and score range

type ScoreTier = "brutal" | "savage" | "harsh" | "mild" | "respect";

function getTier(score: number): ScoreTier {
  if (score <= 25) return "brutal";
  if (score <= 50) return "savage";
  if (score <= 70) return "harsh";
  if (score <= 85) return "mild";
  return "respect";
}

const overallRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "Your app is a digital war crime. The Geneva Convention called — they want a word.",
    "This is what happens when AI writes code and nobody checks the homework.",
    "We've seen better quality from a GeoCities page in 2003.",
    "Your app has more issues than a therapy patient with abandonment problems.",
    "Congrats, you've built the digital equivalent of a dumpster fire.",
  ],
  savage: [
    "Not the worst we've seen. But the bar is in hell, and you're limbo dancing under it.",
    "Your app is like a group project where nobody showed up.",
    "This is giving 'I'll fix it later' energy. Spoiler: you won't.",
    "AI built it, nobody tested it, and everyone's paying the price.",
    "It works, technically. So does a car with three wheels.",
  ],
  harsh: [
    "Mediocre. Like microwaved leftovers of web development.",
    "C-minus energy. Your app passed, but the teacher is disappointed.",
    "It's not terrible, but 'not terrible' isn't a LinkedIn endorsement.",
    "You're in the uncanny valley of web quality — close enough to notice the flaws.",
    "Average. The beige of websites. The room-temperature water of apps.",
  ],
  mild: [
    "Not bad. You clearly tried. Some things even work properly.",
    "Better than 70% of what we scan. That's either a compliment or a condemnation of the industry.",
    "Solid B-student energy. Your parents would say 'we're proud of you' with minimal hesitation.",
    "Close to good. Like a dress rehearsal that's almost ready for opening night.",
    "You're almost there. A few fixes and you might actually impress someone.",
  ],
  respect: [
    "OK fine. You actually know what you're doing. Respect.",
    "We tried to roast you but... this is actually good. We're annoyed.",
    "Top tier. Either you're a real engineer or you're very good at pretending.",
    "Your vibe code is... actually good? We need to sit down.",
    "A+ material. You're making the rest of the vibe coders look bad.",
  ],
};

const securityRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "Your app is an open invitation for hackers. Welcome mat included.",
    "Less secure than a post-it note password on a shared monitor.",
    "Your security is so bad, script kiddies use it as a tutorial.",
    "Zero security headers. Your app is basically running naked in public.",
    "Hackers wouldn't even bother — there's nothing worth stealing and no walls to climb.",
  ],
  savage: [
    "Your security has more holes than Swiss cheese at a shooting range.",
    "Some headers, some effort, mostly vibes. Hackers appreciate the easy target.",
    "You've heard of HTTPS, and that's about where your security knowledge ends.",
    "Your app trusts everyone. That's beautiful in a human. Terrifying in software.",
  ],
  harsh: [
    "Security is... present. Like a guard who falls asleep on the job.",
    "You have some defenses, but a determined teenager could get through.",
    "Passing grade, barely. Your security is the C-minus of the category.",
    "Not wide open, not locked down. You're the unlocked car in a safe neighborhood.",
  ],
  mild: [
    "Decent security. A few loose ends but nothing catastrophic.",
    "Most of the headers are there. Most. Close enough to sleep at night.",
    "Your security is like a good fence — keeps out the casual intruders.",
  ],
  respect: [
    "Locked down tight. Even we're impressed.",
    "Your security headers are chef's kiss. Someone actually read the OWASP docs.",
    "Fort Knox vibes. Your app is more secure than most banks' websites.",
  ],
};

const a11yRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "A screen reader tried to use your app and filed a missing persons report for the labels.",
    "Your app is more exclusive than a velvet-rope nightclub — nobody with a disability gets in.",
    "43 accessibility issues. That's not a bug count, that's a human rights violation.",
    "Blind users can't use your app. Neither can anyone with motor issues. Or cognitive issues. Basically, it's only for 20-year-olds with perfect vision.",
    "WCAG would like a word. And a lawyer.",
  ],
  savage: [
    "Some alt text exists, but it's doing the bare minimum. Like 'image.png'. Thanks for nothing.",
    "Your color contrast is so bad, even people with perfect vision are squinting.",
    "You've got form inputs with no labels. Users are just supposed to guess what goes where.",
    "Screen readers hear your page as one long, confused scream.",
  ],
  harsh: [
    "Accessibility is an afterthought, and it shows. Like leftover salad at a buffet.",
    "Some effort was made. Some. It's the 'I tried' participation trophy of a11y.",
    "Contrast issues, missing landmarks, no skip links. The a11y starter pack of failures.",
  ],
  mild: [
    "Mostly accessible. A few blind spots (pun intended) but generally navigable.",
    "Your a11y is like a B+ essay — good structure, some typos.",
    "Close to compliant. A few fixes and you're golden.",
  ],
  respect: [
    "Fully accessible. You either care about humans or you're scared of lawsuits. Either way, respect.",
    "Screen readers love your app. You're a good person.",
    "WCAG AA compliant. Your app welcomes everyone. Beautiful.",
  ],
};

const perfRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "Loading time so slow, users aged a year waiting. Their grandkids will see it load eventually.",
    "Your app loads slower than a government website on dial-up.",
    "Performance so bad, users thought their internet was broken. It wasn't. It's you.",
    "Your bundle size is bigger than some operating systems.",
  ],
  savage: [
    "Your app loads like it's running on a potato powered by hopes and dreams.",
    "3 seconds to first paint. In internet time, that's a geological era.",
    "Users have time to make coffee while your app loads. Espresso, not instant.",
    "The spinner has become a feature, not a loading state.",
  ],
  harsh: [
    "Performance is... fine. If you're patient. Very patient.",
    "Not fast, not slow. The speed limit of the internet highway.",
    "Your app runs like a decent bus service — it gets there, eventually, sometimes.",
  ],
  mild: [
    "Pretty snappy. A couple heavy images but overall solid.",
    "Performance is good. Not blazing, but nobody's complaining.",
    "Fast enough that users don't notice. That's the goal.",
  ],
  respect: [
    "Lightning fast. Your app loads before the user finishes clicking.",
    "Sub-second loads. Your performance is making Vercel proud.",
    "Blazing fast. Whatever you're doing, teach the others.",
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export interface RoastResult {
  overall: string;
  security: string;
  accessibility: string;
  performance: string;
  grade: string;
  tier: ScoreTier;
}

export function getLetterGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 55) return "C-";
  if (score >= 50) return "D+";
  if (score >= 45) return "D";
  if (score >= 40) return "D-";
  return "F";
}

export function generateRoast(
  overallScore: number,
  securityScore: number,
  a11yScore: number,
  perfScore: number
): RoastResult {
  const tier = getTier(overallScore);
  return {
    overall: pickRandom(overallRoasts[tier]),
    security: pickRandom(securityRoasts[getTier(securityScore)]),
    accessibility: pickRandom(a11yRoasts[getTier(a11yScore)]),
    performance: pickRandom(perfRoasts[getTier(perfScore)]),
    grade: getLetterGrade(overallScore),
    tier,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "#22C55E";
  if (score >= 50) return "#FBBF24";
  return "#EF4444";
}

export function getVerdictLabel(score: number): string {
  if (score <= 25) return "BRUTAL";
  if (score <= 50) return "SAVAGE";
  if (score <= 70) return "HARSH";
  if (score <= 85) return "MILD";
  return "CLEAN";
}
