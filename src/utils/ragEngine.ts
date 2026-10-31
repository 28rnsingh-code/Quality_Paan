import { KnowledgeDocument, Product } from '../types';

export interface RagSearchResult {
  document: KnowledgeDocument;
  score: number;
  matchedKeywords: string[];
  snippet: string;
}

/**
 * Clean & tokenize text for retrieval indexing
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ') // Allow English + Devanagari
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Retrieve top-k knowledge documents matching user query using BM25-inspired term frequency scoring
 */
export function searchKnowledgeBase(
  query: string,
  documents: KnowledgeDocument[],
  topK = 4
): RagSearchResult[] {
  const activeDocs = documents.filter((d) => d.active);
  if (!activeDocs.length || !query.trim()) return [];

  const queryTokens = tokenize(query);
  if (!queryTokens.length) return [];

  const results: RagSearchResult[] = [];

  for (const doc of activeDocs) {
    const fullText = `${doc.title} ${doc.category || ''} ${doc.summary || ''} ${doc.content} ${(doc.tags || []).join(' ')}`;
    const docLower = fullText.toLowerCase();
    const docTokens = tokenize(fullText);

    let score = 0;
    const matchedKeywords: string[] = [];

    // Title match boost
    const titleLower = doc.title.toLowerCase();
    for (const q of queryTokens) {
      if (titleLower.includes(q)) {
        score += 8;
        if (!matchedKeywords.includes(q)) matchedKeywords.push(q);
      }
    }

    // Tag match boost
    if (doc.tags && doc.tags.length > 0) {
      for (const tag of doc.tags) {
        const tagLower = tag.toLowerCase();
        for (const q of queryTokens) {
          if (tagLower.includes(q) || q.includes(tagLower)) {
            score += 6;
            if (!matchedKeywords.includes(q)) matchedKeywords.push(q);
          }
        }
      }
    }

    // Content frequency
    for (const token of queryTokens) {
      let count = 0;
      for (const dt of docTokens) {
        if (dt === token) count++;
      }
      if (count > 0) {
        score += Math.log(1 + count) * 3;
        if (!matchedKeywords.includes(token)) matchedKeywords.push(token);
      }
    }

    // Exact phrase match bonus
    const queryClean = query.toLowerCase().trim();
    if (queryClean.length > 5 && docLower.includes(queryClean)) {
      score += 15;
    }

    if (score > 0) {
      // Extract best snippet around the first matched token
      let bestSnippet = doc.summary || doc.content.slice(0, 220);
      for (const mk of matchedKeywords) {
        const idx = docLower.indexOf(mk);
        if (idx !== -1) {
          const start = Math.max(0, idx - 60);
          const end = Math.min(doc.content.length, idx + 180);
          bestSnippet = `...${doc.content.slice(start, end).replace(/\n+/g, ' ')}...`;
          break;
        }
      }

      results.push({
        document: doc,
        score,
        matchedKeywords,
        snippet: bestSnippet,
      });
    }
  }

  // Sort descending by score and return top K
  return results.sort((a, b) => b.score - a.score).slice(0, topK);
}

/**
 * Search product catalog for products mentioned or relevant to user query
 */
export function searchRelevantProducts(query: string, products: Product[], limit = 3): Product[] {
  if (!products.length || !query.trim()) return [];
  const qLower = query.toLowerCase();
  const qTokens = tokenize(query);

  const scored = products
    .map((p) => {
      let score = 0;
      const nameLower = p.name.toLowerCase();
      const catLower = (p.category || '').toLowerCase();
      const descLower = (p.shortDescription || p.description || '').toLowerCase();

      if (nameLower.includes(qLower)) score += 10;
      if (catLower.includes(qLower)) score += 6;

      for (const t of qTokens) {
        if (nameLower.includes(t)) score += 4;
        if (catLower.includes(t)) score += 2;
        if (descLower.includes(t)) score += 1;
      }

      if (p.isBestseller) score += 0.5;
      if (p.isFeatured) score += 0.5;

      return { product: p, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.product);
}
