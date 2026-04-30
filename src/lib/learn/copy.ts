// Personal-CSM voice intro and closing for the Long-Answer Learn page.
//
// In production these strings come from a personalization service that
// considers user role, recent activity, and the query. For the prototype
// we hard-code copy tuned to the canonical demo query (Khoros → Gainsight
// Community migration).

export const introCopy = (_query: string) =>
  `Migrating from Khoros to Gainsight Community is one of the most common patterns we see, and the path is well-mapped. Here's the full picture: what carries over, what doesn't, the recommended end-to-end process, and the authentication and URL decisions you'll want to make in week one. Start with the migration FAQ, walk through the chapters, then come back to the recommendations once you're closer to a cutover date.`;

export const closingCopy = () =>
  `If you want a person to walk through your specific Khoros structure and your URL patterns, the migration team runs a working session on the second Thursday of every month — happy to set that up. Or if you're earlier in the journey, the New to Gainsight Community session next week is the right starting point.`;
