/**
 * Bible Verses for Daily Inspiration
 * Displays a random verse on the home screen each time the app opens
 */

export interface Verse {
  text: string;
  reference: string;
}

export const BIBLE_VERSES: Verse[] = [
  {
    text: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13"
  },
  {
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11"
  },
  {
    text: "The Lord is my shepherd; I shall not want.",
    reference: "Psalm 23:1"
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding.",
    reference: "Proverbs 3:5"
  },
  {
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9"
  },
  {
    text: "Cast all your anxiety on him because he cares for you.",
    reference: "1 Peter 5:7"
  },
  {
    text: "And we know that in all things God works for the good of those who love him.",
    reference: "Romans 8:28"
  },
  {
    text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    reference: "Philippians 4:6"
  },
  {
    text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
    reference: "Psalm 34:18"
  },
  {
    text: "I have told you these things, so that in me you may have peace. In this world you will have trouble. But take heart! I have overcome the world.",
    reference: "John 16:33"
  },
  {
    text: "Come to me, all you who are weary and burdened, and I will give you rest.",
    reference: "Matthew 11:28"
  },
  {
    text: "The Lord will fight for you; you need only to be still.",
    reference: "Exodus 14:14"
  },
  {
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles.",
    reference: "Isaiah 40:31"
  },
  {
    text: "The joy of the Lord is your strength.",
    reference: "Nehemiah 8:10"
  },
  {
    text: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.",
    reference: "2 Timothy 1:7"
  },
  {
    text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    reference: "John 14:27"
  },
  {
    text: "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.",
    reference: "Numbers 6:24-25"
  },
  {
    text: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.",
    reference: "Matthew 7:7"
  },
  {
    text: "For where two or three gather in my name, there am I with them.",
    reference: "Matthew 18:20"
  },
  {
    text: "God is our refuge and strength, an ever-present help in trouble.",
    reference: "Psalm 46:1"
  },
  {
    text: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?",
    reference: "Psalm 27:1"
  },
  {
    text: "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.",
    reference: "Mark 11:24"
  },
  {
    text: "He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain.",
    reference: "Revelation 21:4"
  },
  {
    text: "Consider it pure joy, my brothers and sisters, whenever you face trials of many kinds.",
    reference: "James 1:2"
  },
  {
    text: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you.",
    reference: "Zephaniah 3:17"
  },
];

/**
 * Returns a random verse from the collection
 * @returns A random Verse object
 */
export function getRandomVerse(): Verse {
  return BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)];
}
