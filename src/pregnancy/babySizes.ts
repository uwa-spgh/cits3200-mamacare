// Typical weekly references from NHS Best Start in Life (verified 2026-10-09).
// Measurements switch from head-to-bottom to head-to-heel at week 20.
export interface BabySize {
  week: number;
  lengthCm: number;
  comparison: string;
  emoji: string;
  comparisonType: "size" | "length";
  measurement: "headToBottom" | "headToHeel";
  sourceUrl: string;
}

const weeklySizes: [number, number, string, string, "size" | "length"][] = [
  [4, 0.2, "poppySeed", "", "size"],
  [5, 0.2, "sesameSeed", "", "size"],
  [6, 0.6, "pea", "🫛", "size"],
  [7, 1.0, "grape", "🍇", "size"],
  [8, 1.6, "raspberry", "", "size"],
  [9, 2.2, "strawberry", "🍓", "size"],
  [10, 3.0, "apricot", "", "size"],
  [11, 4.1, "fig", "", "size"],
  [12, 5.4, "plum", "", "size"],
  [13, 7.4, "peach", "🍑", "size"],
  [14, 8.5, "kiwi", "🥝", "size"],
  [15, 10.1, "apple", "🍎", "size"],
  [16, 11.6, "avocado", "🥑", "size"],
  [17, 12.0, "pomegranate", "", "size"],
  [18, 14.2, "bellPepper", "🫑", "size"],
  [19, 15.3, "tomato", "🍅", "size"],
  [20, 25.6, "banana", "🍌", "size"],
  [21, 26.7, "carrot", "🥕", "size"],
  [22, 27.8, "sweetPotato", "🍠", "size"],
  [23, 28.9, "mango", "🥭", "size"],
  [24, 30.0, "corn", "🌽", "size"],
  [25, 34.6, "courgette", "", "size"],
  [26, 35.6, "cucumber", "🥒", "size"],
  [27, 36.6, "cauliflower", "", "size"],
  [28, 37.6, "aubergine", "🍆", "size"],
  [29, 38.6, "squash", "", "size"],
  [30, 39.9, "cabbage", "", "size"],
  [31, 41.1, "coconut", "🥥", "size"],
  [32, 42.4, "celery", "", "length"],
  [33, 43.7, "pineapple", "🍍", "size"],
  [34, 45.0, "cantaloupe", "🍈", "size"],
  [35, 46.2, "honeydew", "🍈", "size"],
  [36, 47.4, "lettuce", "🥬", "size"],
  [37, 48.6, "leek", "", "length"],
  [38, 49.8, "rhubarb", "", "length"],
  [39, 50.7, "watermelon", "🍉", "size"],
  [40, 51.2, "pumpkin", "", "size"],
];

export const BABY_SIZES: readonly BabySize[] = weeklySizes.map(([week, lengthCm, comparison, emoji, comparisonType]) => {
  const trimester = week < 13 ? "1st" : week < 28 ? "2nd" : "3rd";
  return {
    week, lengthCm, comparison, emoji, comparisonType,
    measurement: week < 20 ? "headToBottom" : "headToHeel",
    sourceUrl: `https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/${trimester}-trimester/week-${week}/`,
  };
});

export function getBabySize(weeks: number): BabySize | null {
  return BABY_SIZES.find((size) => size.week === weeks) ?? null;
}
