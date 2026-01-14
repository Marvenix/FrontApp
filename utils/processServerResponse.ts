export type ServerResponse = {
  winner: string;
  confidence: number;
  details: {
    [key: string]: number;
  };
};

export type UiData = {
  best_match: { genre: string; confidence: number };
  breakdown: { genre: string; confidence: number }[];
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const processServerResponse = (data: ServerResponse): UiData | null => {
  if (!data || !data.winner || !data.details) return null;

  const bestMatch = {
    genre: capitalize(data.winner),
    confidence: data.confidence * 100,
  };

  const breakdown = Object.entries(data.details)
    .map(([key, value]) => ({
      genre: capitalize(key),
      confidence: value * 100,
    }))
    .sort((a, b) => b.confidence - a.confidence);

  return {
    best_match: bestMatch,
    breakdown: breakdown,
  };
};
