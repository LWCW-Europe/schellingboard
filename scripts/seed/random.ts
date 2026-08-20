// Deterministic PRNG so repeated seeding produces the same data. Separate
// instances keep the curated sequence stable when bulk generation is added
// on top (large profile) or absent (small profile).
export function createSeededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    const x = Math.sin(state++) * 10000;
    return x - Math.floor(x);
  };
}
