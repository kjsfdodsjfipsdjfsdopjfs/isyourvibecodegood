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

const seoRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "Google doesn't know your app exists. Neither does Bing. Not even Yahoo.",
    "No meta tags, no sitemap, no robots.txt. You're invisible to search engines by choice apparently.",
    "Your SEO is so bad, googling your exact domain returns a pizza shop instead.",
    "Search engines crawl your site and immediately leave. Even bots have standards.",
    "You built something nobody will ever find. Digital witness protection.",
  ],
  savage: [
    "Your meta description is missing. Google is writing your pitch for you. It's not great.",
    "Some SEO basics exist, but it's like putting a 'Please Find Me' sign in the middle of the desert.",
    "Your title tags are either missing or so generic they describe every website ever made.",
    "Structured data? Never heard of it. Neither has Google when it comes to your site.",
  ],
  harsh: [
    "SEO is present but uninspired. Like writing a resume in crayon.",
    "You have meta tags, but they're doing the absolute minimum. Participation trophy SEO.",
    "Your SEO is like whispering at a concert — technically speaking, but nobody hears you.",
  ],
  mild: [
    "Decent SEO. You'll show up in search results, just maybe not on page one.",
    "Most of the SEO boxes are checked. A few tweaks and you'll climb the ranks.",
    "Your SEO is solid. Not a masterclass, but competent.",
  ],
  respect: [
    "SEO game on point. You actually want people to find your app. Revolutionary.",
    "Perfect meta tags, structured data, the works. Google's algorithm is blushing.",
    "Your SEO is so good, competitors are studying your source code.",
  ],
};

const privacyRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "No privacy policy, third-party trackers everywhere. You're basically a data broker with a landing page.",
    "Your app leaks user data like a colander holds water.",
    "GDPR called. You're on the naughty list. The very naughty list.",
    "Users have more privacy on a public bus than on your app.",
    "You collect everything and protect nothing. The surveillance state thanks you.",
  ],
  savage: [
    "Some privacy measures exist, but they're about as effective as a screen door on a submarine.",
    "Cookie consent? Never heard of her. But you've heard of every tracking pixel known to humanity.",
    "Your privacy policy is either missing or written by someone who's never met a lawyer.",
    "Third-party scripts running wild. Your app is a tracking party and everyone's invited.",
  ],
  harsh: [
    "Privacy is an afterthought. Like adding a lock to a glass door.",
    "Some effort on privacy, but there are still trackers you don't even know about.",
    "Your privacy approach is 'hope nobody notices.' Bold strategy.",
  ],
  mild: [
    "Decent privacy practices. A few loose ends but users aren't running for the hills.",
    "Most privacy boxes checked. The privacy officer would give a cautious nod.",
    "Not bad. You actually seem to care about user data. Refreshing.",
  ],
  respect: [
    "Privacy-first approach. Users can trust you with their data. That's rare.",
    "Minimal tracking, proper consent, clear policies. You're the gold standard.",
    "Your privacy setup makes regulators smile. That never happens.",
  ],
};

const mobileRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "Your mobile experience is like trying to read a billboard through a keyhole.",
    "Tap targets so small you need a stylus from 2005 to use your app.",
    "Your app on mobile is a war crime against thumbs everywhere.",
    "Desktop-only in 2024? Bold choice. Wrong, but bold.",
    "The mobile version makes users pinch-zoom until their fingers cramp.",
  ],
  savage: [
    "Your responsive design responds by breaking. Consistently, at least.",
    "Mobile users see half a button and a prayer. Good luck tapping that.",
    "Your app on a phone looks like a newspaper in a blender.",
    "Viewport meta tag exists but your CSS didn't get the memo.",
  ],
  harsh: [
    "Mobile experience is... acceptable. If users tilt their head and squint.",
    "Some responsive effort, but elements still overlap like a bad Tetris game.",
    "Your mobile layout works on exactly one phone model. Yours.",
  ],
  mild: [
    "Mobile is decent. A few layout quirks but generally usable.",
    "Responsive design that actually responds. Most of the time.",
    "Your mobile experience is like a solid B — works, room to improve.",
  ],
  respect: [
    "Flawless on mobile. Thumb-friendly, fast, gorgeous. Chef's kiss.",
    "Your responsive design could be in a textbook. Seriously impressive.",
    "Mobile-first done right. Every element knows where it belongs.",
  ],
};

const uxRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "Your UX is a maze designed by someone who hates humans.",
    "Users need a PhD and a prayer to navigate your app. Good luck with retention.",
    "Your forms have more friction than a gravel road. Nobody's finishing those.",
    "The user journey on your app is: arrive, get confused, leave, never return.",
    "Your UX makes the DMV website look like a spa experience.",
  ],
  savage: [
    "CTAs that don't contrast, flows that don't flow, and menus that lead nowhere.",
    "Users click three times to do what should take one. Efficiency is not your thing.",
    "Your navigation is like IKEA without the arrows. People are lost and frustrated.",
    "Error messages that say 'Something went wrong.' Wow, helpful. Really narrows it down.",
    "Your onboarding flow has more steps than a 12-step program. Users quit at step 2.",
  ],
  harsh: [
    "UX is functional but uninspired. Like a hospital cafeteria — it works, but nobody's excited.",
    "Some flows make sense, others feel like you rolled dice to decide button placement.",
    "Your UX is the 'it's fine' of user experiences. Damning with faint praise.",
  ],
  mild: [
    "Decent UX. Users can figure things out without rage-quitting.",
    "Navigation mostly makes sense. A few dead ends but nothing catastrophic.",
    "Your UX is like a B+ student — does the job, could do better.",
    "Clear enough to use, polished enough to not embarrass you.",
  ],
  respect: [
    "Smooth UX. Intuitive flows, clear CTAs, happy users. You actually tested this.",
    "Your UX is so good, users don't even notice it. That's the highest compliment.",
    "Frictionless experience. You clearly talked to actual humans before building this.",
    "UX perfection. The kind of flow that makes competitors jealous.",
  ],
};

const designRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "Your design looks like a ransom note made in MS Paint. During an earthquake.",
    "Comic Sans would be an upgrade. I'm not joking.",
    "Your color palette was chosen by a blindfolded person throwing darts at a Pantone chart.",
    "This design makes MySpace pages from 2006 look like modern art.",
    "Your app looks like it was designed by an AI that was trained exclusively on spam emails.",
  ],
  savage: [
    "Fonts fighting each other, colors clashing, spacing that makes no sense. It's a visual cage match.",
    "Your design has the visual appeal of a government form. From the 90s.",
    "Gradients, drop shadows, and 14 different fonts. Pick a lane.",
    "Your hero section is doing too much and saying too little. Less is more. Way more.",
    "The design says 'I have Canva' but not 'I know how to use Canva.'",
  ],
  harsh: [
    "Design is serviceable. Not offensive, not inspiring. Like elevator music in visual form.",
    "Some design sense exists, but it's buried under inconsistent spacing and random font sizes.",
    "Your design is fine. F-I-N-E. The most devastating word in creative feedback.",
  ],
  mild: [
    "Clean design. A few rough edges but the vibe is there.",
    "Your visual design is solid. Consistent colors, decent typography. Almost polished.",
    "Design is good enough to take seriously. A designer's touch away from great.",
    "Nice aesthetic. Cohesive look, good spacing. You've got taste.",
  ],
  respect: [
    "Beautiful design. This actually looks like a real product, not a hackathon project.",
    "Your design is chef's kiss. Consistent, clean, and confident.",
    "Stunning visual design. Whoever did this has an eye for detail.",
    "Your app looks like it costs money to use. That's a compliment.",
  ],
};

const humanAppealRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "Zero trust signals. Your app feels like a phishing page with better CSS.",
    "No testimonials, no about page, no faces, no soul. Just vibes — bad ones.",
    "Users trust gas station sushi more than your app. At least sushi has an expiry date.",
    "Your app has the warmth and personality of a parking garage.",
    "No social proof anywhere. It's like walking into an empty restaurant and wondering why.",
  ],
  savage: [
    "Where's the team page? The testimonials? Anything that says 'real humans made this'?",
    "Your app has the personality of an automated voicemail. Press 1 to leave.",
    "No reviews, no case studies, no trust badges. Users are expected to trust blindly. They won't.",
    "Your about page is either missing or says 'Lorem ipsum.' Either way, yikes.",
    "The human appeal of your app is somewhere between a vending machine and a DMV kiosk.",
  ],
  harsh: [
    "Some trust signals exist, but they're giving 'we asked our mom for a testimonial' energy.",
    "A little personality peeks through, but mostly it's corporate robot speak.",
    "Your app has human appeal in the same way that a spreadsheet has charm.",
  ],
  mild: [
    "Decent human touch. Some social proof, reasonable about section. Not soulless.",
    "Your app feels like it was made by real people. That counts for a lot.",
    "Good trust signals. Users probably won't assume it's a scam. Probably.",
    "There's warmth here. Not a bonfire, but at least a candle.",
  ],
  respect: [
    "Your app radiates trust. Testimonials, real photos, clear team page. Users feel safe.",
    "Human appeal off the charts. This feels like a product people actually love.",
    "Social proof everywhere, genuine voice, real personality. This is how you build trust.",
    "Your app feels human. In a world of AI slop, that's the highest praise.",
  ],
};

const businessRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "No pricing, no CTA, no business model. You're cosplaying as a startup.",
    "Your business strategy is 'build it and they will come.' They won't.",
    "This app has no value proposition. It exists out of sheer stubbornness.",
    "No clear offering, no conversion path, no revenue plan. Just vibes and prayers.",
    "Your app is a solution looking for a problem. And not finding one.",
  ],
  savage: [
    "A vague CTA, no pricing page, and a business model held together by hope.",
    "Your value prop is buried so deep, archaeologists couldn't find it.",
    "You have a product but no business. That's called an expensive hobby.",
    "The business fundamentals here are giving 'I'll monetize later' energy. Spoiler: later never comes.",
    "Your landing page says a lot of words and communicates absolutely nothing about what you sell.",
  ],
  harsh: [
    "Business basics are present but uninspiring. Like a lemonade stand with a mission statement.",
    "Some business thinking exists, but the execution says 'first draft.'",
    "Your business model is there if you squint. Might want to make it more obvious.",
  ],
  mild: [
    "Decent business fundamentals. Clear offering, reasonable positioning.",
    "Your business model makes sense. A few gaps but the foundation is solid.",
    "Good enough to pitch. Not good enough to get funded, but getting there.",
    "Clear value proposition, decent CTA placement. You've thought about this.",
  ],
  respect: [
    "Strong business fundamentals. Clear value prop, compelling CTA, obvious monetization.",
    "Your business model is tight. Investors would nod approvingly.",
    "This looks like a real business. Value prop is clear, pricing makes sense, CTA converts.",
    "Business-savvy and product-smart. You're not just building, you're building a business.",
  ],
};

const revenueRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "No payment integration, no pricing, no checkout. You're giving everything away for free. On purpose?",
    "Your monetization strategy is 'I'll figure it out.' That's not a strategy, that's denial.",
    "No Stripe, no PayPal, no anything. Your app literally cannot make money.",
    "You built a product with zero ability to collect revenue. This is an expensive portfolio piece.",
    "Your revenue model is charity. Except charities at least have a donation button.",
  ],
  savage: [
    "Some pricing exists, buried on page 47 of your app. Nobody's finding it.",
    "You have a 'Pro' tier that nobody knows about because your upgrade flow is invisible.",
    "Monetization is an afterthought here. Your CFO (also you) is crying.",
    "Payment integration exists in the same way that Bigfoot exists — theoretically.",
    "Your checkout flow has more abandonment than a rom-com plot.",
  ],
  harsh: [
    "Revenue setup is functional but not optimized. You're leaving money on the table.",
    "Pricing page exists but doesn't inspire confidence or urgency.",
    "Some monetization thought, but the execution is 'meh.' Like a tip jar at a self-checkout.",
  ],
  mild: [
    "Decent revenue setup. Pricing is clear, payment works. Could optimize more.",
    "Your monetization is solid. Not maximized, but you're making money.",
    "Good payment integration, reasonable pricing tiers. Revenue is flowing.",
    "You've thought about money. That alone puts you ahead of 80% of vibe coders.",
  ],
  respect: [
    "Revenue machine. Clear pricing, smooth checkout, multiple tiers. Cha-ching.",
    "Your monetization strategy is textbook. Investors are getting interested.",
    "Payment flow is frictionless. You actually care about making money. Respect.",
    "Your revenue setup would make a CFO weep with joy. Everything is optimized.",
  ],
};

const growthRoasts: Record<ScoreTier, string[]> = {
  brutal: [
    "No blog, no social sharing, no SEO content. Your growth strategy is 'hope.'",
    "Zero organic growth potential. Your app will die in obscurity. Peacefully, at least.",
    "No share buttons, no referral system, no viral loops. Growth hacking? More like growth napping.",
    "Your app has the viral potential of a rock. A small, boring rock.",
    "No content strategy, no community, no outreach. Your CAC is infinity.",
  ],
  savage: [
    "A share button exists but it shares to... nowhere useful. Growth theater at its finest.",
    "Your blog has two posts from 2023 and both are 'Hello World.' Compelling content strategy.",
    "Social links go to empty profiles. That's not growth, that's a ghost town.",
    "Your referral program is 'tell a friend.' Groundbreaking stuff.",
    "Growth metrics are just you refreshing your own dashboard. We've all been there.",
  ],
  harsh: [
    "Some growth mechanisms exist but they're not going to move the needle.",
    "You have social sharing but no reason for anyone to actually share.",
    "Growth is on autopilot. Unfortunately, the autopilot is asleep.",
  ],
  mild: [
    "Decent growth setup. Blog exists, sharing works, analytics are tracking.",
    "Your growth fundamentals are there. Content, social, basic viral hooks.",
    "Good enough to grow organically. Not virally, but steadily.",
    "Growth potential is real. A few tweaks and you'll see compound effects.",
  ],
  respect: [
    "Growth engine is humming. Blog, social proof, referrals, viral loops. The whole package.",
    "Your growth strategy would make a growth hacker jealous. Everything is optimized.",
    "Organic growth machine. Content, community, conversion — you've cracked the code.",
    "Your growth setup is so good, competitors are reverse-engineering your funnel.",
  ],
};

// Map category keys to their roast collections
const categoryRoastMap: Record<string, Record<ScoreTier, string[]>> = {
  security: securityRoasts,
  accessibility: a11yRoasts,
  performance: perfRoasts,
  seo: seoRoasts,
  privacy: privacyRoasts,
  mobile: mobileRoasts,
  ux: uxRoasts,
  design: designRoasts,
  human_appeal: humanAppealRoasts,
  business: businessRoasts,
  revenue: revenueRoasts,
  growth: growthRoasts,
};

// Pillar-level roasts
const pillarRoasts: Record<string, Record<ScoreTier, string[]>> = {
  technical: {
    brutal: [
      "Your technical foundation is a house of cards in a hurricane.",
      "The tech stack is held together by duct tape and dreams.",
      "Every technical metric is screaming for help. Nobody's listening.",
    ],
    savage: [
      "Technically functional, like a car that only starts on warm days.",
      "Your tech fundamentals need serious work. The cracks are showing.",
      "The technical side is giving 'it works on my machine' energy.",
    ],
    harsh: [
      "Technical execution is mid. Not broken, not great. Just... there.",
      "Passable tech. The kind that works until it doesn't.",
    ],
    mild: [
      "Solid technical foundation. A few rough spots but nothing scary.",
      "Technically sound. Most things work well, some need polish.",
    ],
    respect: [
      "Technical excellence. Clean, fast, secure, accessible. The full package.",
      "Your tech stack is pristine. Engineers would be proud to inherit this.",
    ],
  },
  product: {
    brutal: [
      "This isn't a product, it's a cry for help with a domain name.",
      "Your product sense is non-existent. Users are confused, lost, and leaving.",
      "Nobody would use this by choice. It's the digital equivalent of a waiting room.",
    ],
    savage: [
      "A product in theory only. The UX, design, and trust are all struggling.",
      "Your product feels like it was built for robots, not humans.",
      "Product quality says 'MVP' but it's been live for how long now?",
    ],
    harsh: [
      "Product is okay. Not something you'd brag about, but not embarrassing either.",
      "Decent product fundamentals. Needs a designer's touch and some user testing.",
    ],
    mild: [
      "Good product instincts. Users can figure it out and it looks decent.",
      "Your product is getting there. Clean up the edges and you're golden.",
    ],
    respect: [
      "Beautiful product. Great UX, gorgeous design, trustworthy feel. Users love this.",
      "Product perfection. This feels like something a real team shipped with pride.",
    ],
  },
  business: {
    brutal: [
      "There's no business here. Just a deployed app and a dream.",
      "Your business model is 'exist on the internet.' That's not a business, that's a blog.",
      "Zero revenue potential, zero growth strategy. This is an expensive portfolio piece.",
    ],
    savage: [
      "Business fundamentals are shaky. You have a product but not a company.",
      "Monetization and growth are afterthoughts. The VCs are not calling back.",
      "Your business strategy fits on a napkin. A small napkin. With nothing written on it.",
    ],
    harsh: [
      "Some business thinking, but it needs work. The revenue and growth pieces are weak.",
      "Business basics are there, but you're not going to get rich with this setup.",
    ],
    mild: [
      "Decent business sense. Revenue flows, growth is happening. Keep pushing.",
      "Your business fundamentals are solid. Not a unicorn yet, but heading somewhere.",
    ],
    respect: [
      "This is a real business. Revenue, growth, clear value prop. You're making money.",
      "Business machine. Everything from pricing to growth is dialed in. Impressive.",
    ],
  },
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

// Category display metadata
export const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  accessibility: { label: "Accessibility", icon: "♿" },
  security: { label: "Security", icon: "🔒" },
  performance: { label: "Performance", icon: "⚡" },
  seo: { label: "SEO", icon: "🔍" },
  privacy: { label: "Privacy", icon: "🛡" },
  mobile: { label: "Mobile", icon: "📱" },
  ux: { label: "UX", icon: "🖱" },
  design: { label: "Design", icon: "🎨" },
  human_appeal: { label: "Human Appeal", icon: "🤝" },
  business: { label: "Business", icon: "💼" },
  revenue: { label: "Revenue", icon: "💰" },
  growth: { label: "Growth", icon: "📈" },
};

export const PILLAR_META: Record<string, { label: string; emoji: string; weight: string }> = {
  technical: { label: "Technical Reality", emoji: "📊", weight: "40%" },
  product: { label: "Product Reality", emoji: "🎨", weight: "35%" },
  business: { label: "Business Reality", emoji: "💰", weight: "25%" },
};

export interface PillarData {
  pillar: string;
  score: number;
  categories: { category: string; score: number; violations?: number }[];
}

export interface RoastResult {
  overall: string;
  security: string;
  accessibility: string;
  performance: string;
  grade: string;
  tier: ScoreTier;
  categoryRoasts: Record<string, string>;
  pillarRoasts: Record<string, string>;
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

export function getCategoryRoast(category: string, score: number): string {
  const roasts = categoryRoastMap[category];
  if (!roasts) return "";
  return pickRandom(roasts[getTier(score)]);
}

export function getPillarRoast(pillar: string, score: number): string {
  const roasts = pillarRoasts[pillar];
  if (!roasts) return "";
  return pickRandom(roasts[getTier(score)]);
}

export function generateRoast(
  overallScore: number,
  securityScore: number,
  a11yScore: number,
  perfScore: number,
  allCategories?: { category: string; score: number }[],
  pillars?: PillarData[]
): RoastResult {
  const tier = getTier(overallScore);

  // Generate roasts for all available categories
  const categoryRoastsResult: Record<string, string> = {};
  if (allCategories) {
    for (const cat of allCategories) {
      categoryRoastsResult[cat.category] = getCategoryRoast(cat.category, cat.score);
    }
  }

  // Generate pillar-level roasts
  const pillarRoastsResult: Record<string, string> = {};
  if (pillars) {
    for (const p of pillars) {
      pillarRoastsResult[p.pillar] = getPillarRoast(p.pillar, p.score);
    }
  }

  return {
    overall: pickRandom(overallRoasts[tier]),
    security: pickRandom(securityRoasts[getTier(securityScore)]),
    accessibility: pickRandom(a11yRoasts[getTier(a11yScore)]),
    performance: pickRandom(perfRoasts[getTier(perfScore)]),
    grade: getLetterGrade(overallScore),
    tier,
    categoryRoasts: categoryRoastsResult,
    pillarRoasts: pillarRoastsResult,
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

export function getShipReadinessColor(verdict: string): string {
  switch (verdict) {
    case "SHIP IT": return "#22C55E";
    case "ALMOST READY": return "#FBBF24";
    case "NEEDS WORK": return "#F97316";
    case "DO NOT SHIP": return "#EF4444";
    default: return "#FBBF24";
  }
}
