import { Product, ProductUnit, SimulatedAiParseResult, ParsedTransactionItem } from '@/types';

/**
 * Word to number mappings for English, Hindi/Hinglish, and Gujarati.
 */
const NUMBER_WORD_MAP: Record<string, number> = {
  // English
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  half: 0.5,

  // Hindi / Hinglish
  ek: 1,
  do: 2,
  teen: 3,
  char: 4,
  chaar: 4,
  paanch: 5,
  panch: 5,
  chhe: 6,
  chheh: 6,
  saat: 7,
  aath: 8,
  nau: 9,
  das: 10,
  aadha: 0.5,
  adhey: 0.5,

  // Gujarati
  be: 2,
  tran: 3,
  chha: 6,
  nav: 9,
  aadho: 0.5,

  // Devanagari & Gujarati numerals in words
  एक: 1,
  दो: 2,
  तीन: 3,
  चार: 4,
  पांच: 5,
  पाँच: 5,
  छह: 6,
  सात: 7,
  आठ: 8,
  नौ: 9,
  दस: 10,
  એક: 1,
  બે: 2,
  ત્રણ: 3,
  પાંચ: 5,
  છ: 6,
  નવ: 9,
};

/**
 * Unit regex matchers mapped to canonical ProductUnit
 */
const UNIT_REGEX_RULES: Array<{ regex: RegExp; unit: ProductUnit }> = [
  { regex: /\b(packets?|pkts?|पैकेट|પેકેટ)\b/i, unit: 'packet' },
  { regex: /\b(pieces?|pcs?|pc\b|पीस|નંગ)\b/i, unit: 'piece' },
  { regex: /\b(kgs?|kilos?|kilograms?|किलो|કિલો)\b/i, unit: 'kg' },
  { regex: /\b(gms?|grams?|g\b|ग्राम|ગ્રામ)\b/i, unit: 'gm' },
  { regex: /\b(liters?|litres?|ltrs?|l\b|लीटर|લીટર)\b/i, unit: 'liter' },
  { regex: /\b(mls?|मिली)\b/i, unit: 'ml' },
  { regex: /\b(bottles?|botals?|बोतल|બોટલ|cans?)\b/i, unit: 'bottle' },
  { regex: /\b(boxes?|dabba|dappe|डिब्बा|ડબ્બો)\b/i, unit: 'box' },
];

/**
 * Common prefixes to strip (time, conversational politeness)
 */
const PREFIX_REGEX =
  /^\s*(aaj|today|abhi|kal|bhai|bhaiya|sethji|please|kripya|sun|dekho|hello|namaste|kem cho)\b[\s,]*/i;

/**
 * Common selling verb phrases to strip from the input
 */
const SALE_VERB_REGEX =
  /\b(bech diye|bech diya|bik gaya|bik gaye|sell thai|sell thaya|sell thayi|vechan thayu|vechya|khapya|aapi|aapyo|sold|sell|sale hue|sale hua|sale kiye|sale|bike|bika|biki|beche|diye|diya)\b[\s.]*$/i;

/**
 * Compound sentence conjunctions used to split multiple items
 */
const CONJUNCTIONS = [
  /\s+aur\s+/i,
  /\s+and\s+/i,
  /\s+ane\s+/i,
  /\s+tatha\s+/i,
  /\s+और\s+/u,
  /\s+અને\s+/u,
  /\s*,\s*/,
  /\s*\+\s*/,
  /\s*&\s*/,
];

/**
 * Deterministic local simulation of a retail transaction command parser.
 * Works 100% offline without connecting to external AI or servers.
 */
export function parseSimulatedTransaction(
  input: string,
  products: Product[]
): SimulatedAiParseResult {
  const sanitized = input.trim();
  if (!sanitized) {
    return {
      action: 'record_sale',
      rawInput: input,
      items: [],
      clarificationStatus: 'unrecognized',
      explanation: 'Please enter a spoken or written sale command to parse.',
      confidence: 0,
    };
  }

  // 1. Clean prefixes & suffixes
  let cleaned = sanitized.replace(PREFIX_REGEX, '').trim();
  cleaned = cleaned.replace(SALE_VERB_REGEX, '').trim();

  // If entire input was just a verb (e.g. "bech diye"), return error
  if (!cleaned) {
    return {
      action: 'record_sale',
      rawInput: input,
      items: [],
      clarificationStatus: 'unrecognized',
      explanation: 'No product or quantity was recognized in the sentence.',
      confidence: 0,
    };
  }

  // 2. Split compound phrases into item segments
  let segments: string[] = [cleaned];
  for (const conj of CONJUNCTIONS) {
    const nextSegments: string[] = [];
    for (const seg of segments) {
      const parts = seg.split(conj).map((s) => s.trim()).filter(Boolean);
      nextSegments.push(...parts);
    }
    segments = nextSegments;
  }

  const parsedItems: ParsedTransactionItem[] = [];

  for (const segment of segments) {
    let segText = segment.trim();
    // Also clean any verb residue inside the segment
    segText = segText.replace(SALE_VERB_REGEX, '').trim();

    if (!segText) continue;

    // Extract quantity
    let quantity = 1;

    // Check for digit match: e.g. "5 packet" or "2.5 kg"
    const digitMatch = segText.match(/\b(\d+(?:\.\d+)?)\b/);
    if (digitMatch) {
      const parsedNum = parseFloat(digitMatch[1]);
      if (!isNaN(parsedNum) && parsedNum > 0) {
        quantity = parsedNum;
        // remove matched digit from segText
        segText = segText.replace(digitMatch[0], ' ').trim();
      }
    } else {
      // Check for word numbers: "panch", "do", "teen", etc.
      const words = segText.split(/\s+/);
      for (const w of words) {
        const lowerW = w.toLowerCase();
        if (NUMBER_WORD_MAP[lowerW] !== undefined) {
          quantity = NUMBER_WORD_MAP[lowerW];
          // remove matched number word
          segText = segText.replace(new RegExp(`\\b${w}\\b`, 'i'), ' ').trim();
          break;
        }
      }
    }

    // Extract unit
    let unit: ProductUnit | undefined;
    for (const rule of UNIT_REGEX_RULES) {
      if (rule.regex.test(segText)) {
        unit = rule.unit;
        segText = segText.replace(rule.regex, ' ').trim();
        break;
      }
    }

    // Clean remaining string to isolate raw product name
    const rawProductName = segText
      .replace(/\s+/g, ' ')
      .replace(/^[-,:.]+|[-,:.]+$/g, '')
      .trim();

    // Match product against active catalog
    const { matchedProduct, candidateProducts, status } = matchProductInCatalog(
      rawProductName,
      unit,
      products
    );

    let warning: string | undefined;
    if (matchedProduct && matchedProduct.stockQuantity < quantity) {
      warning = `Warning: Low stock! Only ${matchedProduct.stockQuantity} ${matchedProduct.unit} available in inventory.`;
    }

    parsedItems.push({
      rawText: segment,
      rawProductName: rawProductName || segment,
      quantity,
      unit: unit || matchedProduct?.unit,
      matchedProduct,
      candidateProducts: candidateProducts.length > 0 ? candidateProducts : undefined,
      status,
      warning,
    });
  }

  if (parsedItems.length === 0) {
    return {
      action: 'record_sale',
      rawInput: input,
      items: [],
      clarificationStatus: 'unrecognized',
      explanation: 'Could not extract any products or quantities from the phrase.',
      confidence: 0,
    };
  }

  // Determine overall clarification status
  const hasUnrecognized = parsedItems.some((it) => it.status === 'unrecognized');
  const hasAmbiguous = parsedItems.some((it) => it.status === 'ambiguous');

  let clarificationStatus: SimulatedAiParseResult['clarificationStatus'] = 'ready';
  let explanation = '';

  if (hasUnrecognized) {
    clarificationStatus = 'unrecognized';
    const unrecognizedNames = parsedItems
      .filter((it) => it.status === 'unrecognized')
      .map((it) => `"${it.rawProductName}"`)
      .join(', ');
    explanation = `Could not find matching product(s) for ${unrecognizedNames} in your shop inventory. Please map them manually below.`;
  } else if (hasAmbiguous) {
    clarificationStatus = 'needs_clarification';
    explanation = `Some phrases matched multiple products (e.g. general terms like "cold drink" or "biscuit"). Please select the exact item.`;
  } else {
    clarificationStatus = 'ready';
    explanation = `Successfully recognized ${parsedItems.length} item(s) from local rule-based intent parsing. Review and confirm below.`;
  }

  return {
    action: 'record_sale',
    rawInput: input,
    items: parsedItems,
    clarificationStatus,
    explanation,
    confidence: clarificationStatus === 'ready' ? 0.95 : 0.6,
  };
}

/**
 * Match a raw product string against stored products using aliases,
 * phonetic likeness, and category tokens.
 */
function matchProductInCatalog(
  rawName: string,
  preferredUnit: ProductUnit | undefined,
  products: Product[]
): {
  matchedProduct?: Product;
  candidateProducts: Product[];
  status: 'matched' | 'ambiguous' | 'unrecognized';
} {
  const norm = rawName.toLowerCase().trim();
  if (!norm) {
    return { candidateProducts: [], status: 'unrecognized' };
  }

  const activeProducts = products.filter((p) => p.isActive);

  // 1. Exact match on Product Name or Aliases
  for (const prod of activeProducts) {
    if (prod.name.toLowerCase() === norm) {
      return { matchedProduct: prod, candidateProducts: [prod], status: 'matched' };
    }
    if (prod.altNames && prod.altNames.some((alias) => alias.toLowerCase() === norm)) {
      return { matchedProduct: prod, candidateProducts: [prod], status: 'matched' };
    }
  }

  // 2. Substring or Word containment match
  const matches: Array<{ product: Product; score: number }> = [];

  for (const prod of activeProducts) {
    let score = 0;
    const prodNameLower = prod.name.toLowerCase();

    // Check name
    if (prodNameLower.includes(norm) || norm.includes(prodNameLower)) {
      score += 5;
    }

    // Check individual words
    const normWords = norm.split(/\s+/);
    for (const word of normWords) {
      if (word.length >= 3) {
        if (prodNameLower.includes(word)) score += 3;
        if (prod.category.toLowerCase().includes(word)) score += 2;
      }
    }

    // Check aliases
    if (prod.altNames) {
      for (const alias of prod.altNames) {
        const aliasLower = alias.toLowerCase();
        if (aliasLower.includes(norm) || norm.includes(aliasLower)) {
          score += 6;
        }
        for (const word of normWords) {
          if (word.length >= 3 && aliasLower.includes(word)) {
            score += 4;
          }
        }
      }
    }

    // Preferred unit bonus
    if (preferredUnit && prod.unit === preferredUnit) {
      score += 1;
    }

    // Common colloquial aliases
    if (norm.includes('maggi') || norm.includes('maggie') || norm.includes('मैगी') || norm.includes('મેગી')) {
      if (prod.name.toLowerCase().includes('maggi')) score += 10;
    }
    if (norm.includes('thums') || norm.includes('cold drink') || norm.includes('pepsi') || norm.includes('coke')) {
      if (prod.category === 'beverages' || prod.name.toLowerCase().includes('thums')) score += 8;
    }
    if (norm.includes('biscuit') || norm.includes('parle') || norm.includes('बिस्कुट') || norm.includes('બિસ્કિટ')) {
      if (prod.name.toLowerCase().includes('parle') || prod.category === 'snacks') score += 8;
    }
    if (norm.includes('milk') || norm.includes('doodh') || norm.includes('दूध') || norm.includes('દૂધ')) {
      if (prod.category === 'dairy' || prod.name.toLowerCase().includes('milk')) score += 8;
    }
    if (norm.includes('atta') || norm.includes('आटा') || norm.includes('લોટ') || norm.includes('flour')) {
      if (prod.name.toLowerCase().includes('atta') || prod.category === 'staples') score += 8;
    }
    if (norm.includes('sugar') || norm.includes('cheeni') || norm.includes('chini') || norm.includes('चीनी') || norm.includes('ખાંડ')) {
      if (prod.name.toLowerCase().includes('sugar')) score += 8;
    }
    if (norm.includes('tea') || norm.includes('chai') || norm.includes('चाय') || norm.includes('ચા')) {
      if (prod.name.toLowerCase().includes('tea') || prod.name.toLowerCase().includes('bakri')) score += 8;
    }
    if (norm.includes('oil') || norm.includes('tel') || norm.includes('तेल') || norm.includes('તેલ')) {
      if (prod.name.toLowerCase().includes('oil')) score += 8;
    }
    if (norm.includes('salt') || norm.includes('namak') || norm.includes('नमक') || norm.includes('મીઠું')) {
      if (prod.name.toLowerCase().includes('salt')) score += 8;
    }

    if (score >= 4) {
      matches.push({ product: prod, score });
    }
  }

  // Sort descending by score
  matches.sort((a, b) => b.score - a.score);

  if (matches.length === 0) {
    return {
      candidateProducts: activeProducts.slice(0, 5),
      status: 'unrecognized',
    };
  }

  // If one clear winner (or only 1 match)
  if (matches.length === 1 || matches[0].score >= matches[1].score + 4) {
    return {
      matchedProduct: matches[0].product,
      candidateProducts: matches.map((m) => m.product),
      status: 'matched',
    };
  }

  // If ambiguous (multiple items score similarly, e.g. "cold drink" or "biscuit")
  return {
    candidateProducts: matches.map((m) => m.product),
    status: 'ambiguous',
  };
}
