// Articles for the Education Library. Keyed by the
// same id as the matching entry in constants/health-education.ts.
import type { Href } from "expo-router";

export interface ArticleLink {
  label: string;
  screen: "DangerSigns" | "Article" | "AddMedication";  // add screens as needed
  params?: Record<string, unknown>;
}

export interface ArticleSection {
  heading: string;
  intro?: string;
  bullets?: string[];
  body?: string;
  note?: string;
  link?: ArticleLink;
}

export interface Article {
  id: string;
  title: string;
  summary?: string;
  sections: ArticleSection[];
  goodToKnow?: ArticleSection;
}

const AVERAGE_READING_WORDS_PER_MINUTE = 200;

function collectSectionText(section: ArticleSection): string {
  return [section.intro, ...(section.bullets ?? []), section.body, section.note]
    .filter((value): value is string => Boolean(value))
    .join(" ");
}

// Estimated read time from actual word count
export function estimateReadTime(article: Article): number {
  const text = [
    article.summary,
    ...article.sections.map(collectSectionText),
    article.goodToKnow ? collectSectionText(article.goodToKnow) : "",
  ]
    .filter(Boolean)
    .join(" ");

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / AVERAGE_READING_WORDS_PER_MINUTE));
  return minutes;
}

export const ARTICLES: Record<string, Article> = {
  "healthy-nutrition": {
    id: "healthy-nutrition",
    title: "Healthy Nutrition",
    summary: "Eating well during pregnancy helps support your health and your baby's growth.",
    sections: [
      {
        heading: "Eat a balanced diet",
        intro: "Try to eat a variety of affordable, locally available foods, such as:",
        bullets: [
          "Rice and other staple foods",
          "Lentils (dal)",
          "Green leafy vegetables",
          "Other vegetables",
          "Eggs",
          "Fish",
          "Fruits",
        ],
      },
      {
        heading: "Iron and folic acid",
        bullets: [
          "Take your daily iron-folic acid (IFA) tablets as advised by your health worker.",
          "IFA helps prevent anaemia and supports your baby's growth.",
        ],
      },
      {
        heading: "Calcium",
        bullets: [
          "Take calcium tablets as recommended by your health worker.",
          "Calcium helps keep your bones and your baby's bones healthy.",
        ],
      },
      {
        heading: "If you feel nauseous",
        bullets: ["Try eating small, frequent meals.", "Drink enough water and other fluids."],
      },
      {
        heading: "Rest and wellbeing",
        bullets: [
          "Get enough rest and sleep when you can.",
          "Eat regularly and drink enough fluids, especially in hot weather.",
        ],
      },
    ],
    goodToKnow: {
      heading: "Good to know",
      bullets: [
        "Wash your hands regularly.",
        "Drink safe water.",
        "Keep food clean and well cooked.",
        "Avoid alcohol, tobacco and other harmful substances.",
        "Do not take medicines without advice from a health worker.",
      ],
    },
  },

  "anc-visits": {
    id: "anc-visits",
    title: "Importance of ANC Visits",
    summary:
      "Antenatal care (ANC) helps you and your health worker monitor your health and your baby's growth during pregnancy.",
    sections: [
      {
        heading: "Start ANC early",
        bullets: [
          "Start antenatal care as early as possible in pregnancy.",
          "Your first ANC visit should be early in pregnancy.",
        ],
      },
      {
        heading: "Attend all your scheduled visits",
        bullets: [
          "Go to every ANC visit recommended for you.",
          "Regular check-ups help monitor your health and your baby's wellbeing.",
          "Keep your ANC card and follow the advice given by your health worker.",
        ],
      },
      {
        heading: "What may happen during ANC",
        intro: "Your health worker may check:",
        bullets: [
          "Blood pressure",
          "Weight and height",
          "Urine",
          "Haemoglobin and anaemia",
          "Blood group",
          "Blood sugar",
          "Your baby's growth and wellbeing",
        ],
        note: "Your health worker may also provide advice about nutrition, supplements, maternal immunisation, birth preparation and danger signs.",
      },
    ],
    goodToKnow: {
      heading: "Good to know",
      body: "Do not wait until you feel unwell to attend ANC. Regular care helps identify problems early and allows you to receive the care and advice you need.",
    },
  },

  "maternal-immunisation": {
    id: "maternal-immunisation",
    title: "Maternal Immunisation",
    summary: "Vaccines during pregnancy help protect you and your baby from serious infections.",
    sections: [
      {
        heading: "Take recommended vaccines",
        bullets: [
          "Ask your health worker which vaccines you need during pregnancy.",
          "Take your vaccines according to the recommended schedule.",
          "Keep your vaccination card safe and bring it to your ANC visits.",
        ],
      },
    ],
    goodToKnow: {
      heading: "Good to know",
      body: "Vaccination during pregnancy helps protect both you and your baby. Talk to your health worker if you have questions about your vaccines.",
    },
  },

  "birth-preparedness": {
    id: "birth-preparedness",
    title: "Birth Preparedness",
    summary: "Preparing for birth before labour starts can help you and your family be ready.",
    sections: [
      {
        heading: "Plan your place of delivery",
        bullets: [
          "Decide where you will give birth.",
          "Choose a health facility where skilled health workers can provide care.",
          "Discuss your birth plan with your family or support person.",
        ],
      },
      {
        heading: "Plan transport",
        bullets: [
          "Decide how you will reach the health facility.",
          "Arrange transport in advance.",
          "Keep an emergency transport option ready.",
        ],
      },
      {
        heading: "Save important contacts",
        intro: "Keep phone numbers for:",
        bullets: [
          "Your health worker",
          "Your chosen health facility",
          "Your transport provider",
          "A trusted family member or emergency contact",
        ],
      },
      {
        heading: "Prepare a delivery bag",
        intro: "Prepare important items before labour begins, including:",
        bullets: [
          "Your ANC/vaccination cards",
          "Clothes and personal items for yourself",
          "Clothes and essential items for your baby",
        ],
      },
      {
        heading: "Prepare your family",
        bullets: [
          "Tell your family or support person about your birth plan.",
          "Make sure someone can accompany or support you when needed.",
          "Arrange help with household tasks after the baby is born.",
        ],
      },
    ],
    goodToKnow: {
      heading: "Good to know",
      body: "It is safest to plan to give birth at a health facility with a skilled health worker.",
    },
  },

  "labour-preparation": {
    id: "labour-preparation",
    title: "Labour Preparation",
    summary: "Knowing the signs of labour can help you recognise when it is time to go to the health facility.",
    sections: [
      {
        heading: "Signs that labour may be starting",
        intro: "You may notice:",
        bullets: [
          "Regular stomach tightening or pain that comes and goes and becomes stronger over time.",
          "Lower back pain or cramps.",
          "A small amount of blood-mixed mucus coming from the vagina.",
          "Water leaking from the vagina.",
          "More pressure in the lower abdomen or a feeling that the baby is moving down.",
        ],
      },
      {
        heading: "When should you go to the health facility?",
        intro:
          "Go to your chosen health facility when labour pains become regular or stronger. Go to the health facility immediately if:",
        bullets: [
          "Your water breaks or fluid starts leaking.",
          "You have vaginal bleeding.",
          "You have severe stomach pain.",
          "Your baby's movements decrease or stop.",
          "You have severe headache or blurred vision.",
          "You have fits or convulsions.",
          "You have fever.",
          "You feel very weak, dizzy or have difficulty breathing.",
          "Your hands, feet or face suddenly become swollen.",
          "Labour continues for more than 12 hours without delivery.",
          "A health worker advises you to come to the facility.",
        ],
      },
    ],
    goodToKnow: {
      heading: "Good to know",
      body: "Keep your delivery bag, transport plan and emergency contact numbers ready before labour starts.",
    },
  },

  "breastfeeding-preparation": {
    id: "breastfeeding-preparation",
    title: "Breastfeeding Preparation",
    summary: "Breastfeeding preparation can help you feel ready to feed your baby after birth.",
    sections: [
      {
        heading: "Start breastfeeding early",
        bullets: [
          "Start breastfeeding within 1 hour of birth.",
          "Keep your baby skin-to-skin with you after birth.",
          "Keep your baby warm.",
        ],
      },
      {
        heading: "Give only breastmilk",
        bullets: [
          "Give your baby only breastmilk for the first 6 months.",
          "Do not give water, honey or other food during this time.",
        ],
      },
      {
        heading: "Feed your baby often",
        bullets: [
          "Breastfeed whenever your baby wants, during the day and night.",
          "Offer both breasts during feeding.",
        ],
      },
      {
        heading: "Good breastfeeding position",
        bullets: [
          "Hold your baby close to you, tummy to tummy.",
          "Make sure your baby's mouth opens wide and attaches well to the breast.",
        ],
      },
      {
        heading: "Get help when needed",
        bullets: [
          "If breastfeeding is difficult, ask a health worker for help.",
          "If your breasts become painful, swollen or sore, speak to a health worker.",
        ],
      },
    ],
  },

  "general-pregnancy-advice": {
    id: "general-pregnancy-advice",
    title: "General Pregnancy Advice",
    sections: [
      {
        heading: "Stay active",
        bullets: [
          "Move a little every day, such as walking or gentle stretching.",
          "Rest when you are tired.",
          "Stop activity if you experience pain, dizziness, breathing problems or bleeding.",
        ],
      },
      {
        heading: "Drink enough fluids",
        bullets: [
          "Drink enough water and other fluids every day.",
          "Drink more fluids when the weather is hot.",
        ],
      },
      {
        heading: "Take your medicines and supplements as advised",
        bullets: [
          "Take iron-folic acid and calcium as recommended by your health worker.",
          "Do not take medicines without advice from a health worker.",
        ],
      },
      {
        heading: "Avoid harmful substances",
        bullets: ["Avoid alcohol, tobacco and other harmful substances during pregnancy."],
      },
      {
        heading: "Keep clean",
        bullets: [
          "Wash your hands regularly.",
          "Use safe drinking water.",
          "Keep food clean and well cooked.",
        ],
      },
      {
        heading: "Look after your mental wellbeing",
        bullets: [
          "Feeling worried or tired can happen during pregnancy.",
          "Talk to someone you trust if you feel stressed, sad or overwhelmed.",
        ],
      },
      {
        heading: "Learn about caring for your baby",
        intro: "Before delivery, learn about:",
        bullets: [
          "Breastfeeding",
          "Newborn care",
          "Newborn danger signs",
          "Postnatal care",
          "How your family can support you after birth",
        ],
      },
      {
        heading: "Know the danger signs",
        intro:
          "Do not wait if you have a danger sign. Go to a health facility immediately. Seek medical care immediately if you have:",
        bullets: [
          "Vaginal bleeding",
          "Severe abdominal pain",
          "Severe headache",
          "Blurred vision",
          "High fever",
          "Swelling of the face, hands or feet",
          "Difficulty breathing",
          "Reduced or no baby movement",
          "Convulsions or fits",
        ],
        link: { label: "View the full Danger Signs guide", screen: "DangerSigns" },
      },
    ],
  },
};