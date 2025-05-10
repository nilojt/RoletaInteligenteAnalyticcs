import { RouletteNumber, Round, RoundStatistics } from "@shared/schema";
import { getNumberColor, calculateRoundStats } from "./utils";

// European roulette numbers (0-36)
export const rouletteNumbers: RouletteNumber[] = Array.from({ length: 37 }, (_, i) => ({
  number: i,
  color: getNumberColor(i)
}));

// Local storage key for rounds data
const ROUNDS_STORAGE_KEY = 'roulette_rounds';

// Save rounds to local storage
export const saveRoundsToStorage = (rounds: Round[]): void => {
  try {
    localStorage.setItem(ROUNDS_STORAGE_KEY, JSON.stringify(rounds));
  } catch (error) {
    console.error('Failed to save rounds to localStorage:', error);
  }
};

// Load rounds from local storage
export const loadRoundsFromStorage = (): Round[] => {
  try {
    const data = localStorage.getItem(ROUNDS_STORAGE_KEY);
    if (!data) return [];
    
    const rounds = JSON.parse(data) as Round[];
    return rounds.map(round => ({
      ...round,
      timestamp: new Date(round.timestamp)
    }));
  } catch (error) {
    console.error('Failed to load rounds from localStorage:', error);
    return [];
  }
};

// Get frequency map of numbers from rounds
export const getNumberFrequencies = (rounds: Round[]): Map<number, number> => {
  const frequencies = new Map<number, number>();
  
  // Initialize all numbers with 0 frequency
  for (let i = 0; i <= 36; i++) {
    frequencies.set(i, 0);
  }
  
  // Count occurrences
  rounds.forEach(round => {
    round.numbers.forEach(num => {
      const current = frequencies.get(num) || 0;
      frequencies.set(num, current + 1);
    });
  });
  
  return frequencies;
};

// Get hot numbers (most frequent)
export const getHotNumbers = (rounds: Round[], count: number = 3): number[] => {
  const frequencies = getNumberFrequencies(rounds);
  
  return Array.from(frequencies.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(entry => entry[0]);
};

// Get cold numbers (least frequent)
export const getColdNumbers = (rounds: Round[], count: number = 3): number[] => {
  const frequencies = getNumberFrequencies(rounds);
  
  return Array.from(frequencies.entries())
    .filter(([_, freq]) => freq > 0)  // Only consider numbers that appeared at least once
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(entry => entry[0]);
};

// Calculate round statistics for all stored rounds
export const getRoundsWithStats = (rounds: Round[]): (Round & { stats: RoundStatistics })[] => {
  return rounds.map(round => ({
    ...round,
    stats: calculateRoundStats(round.numbers)
  }));
};

// Calculate overall statistics for parity
export const getParityStats = (rounds: Round[]): { even: number, odd: number } => {
  let evenCount = 0;
  let oddCount = 0;
  let totalNumbers = 0;
  
  rounds.forEach(round => {
    round.numbers.forEach(num => {
      if (num === 0) return; // Skip zero
      if (num % 2 === 0) {
        evenCount++;
      } else {
        oddCount++;
      }
      totalNumbers++;
    });
  });
  
  // Return percentages
  return {
    even: totalNumbers > 0 ? Math.round((evenCount / totalNumbers) * 100) : 0,
    odd: totalNumbers > 0 ? Math.round((oddCount / totalNumbers) * 100) : 0
  };
};

// Calculate overall statistics for colors
export const getColorStats = (rounds: Round[]): { red: number, black: number, green: number } => {
  let redCount = 0;
  let blackCount = 0;
  let greenCount = 0;
  let totalNumbers = 0;
  
  rounds.forEach(round => {
    round.numbers.forEach(num => {
      const color = getNumberColor(num);
      if (color === 'red') redCount++;
      else if (color === 'black') blackCount++;
      else greenCount++;
      totalNumbers++;
    });
  });
  
  // Return percentages
  return {
    red: totalNumbers > 0 ? Math.round((redCount / totalNumbers) * 100) : 0,
    black: totalNumbers > 0 ? Math.round((blackCount / totalNumbers) * 100) : 0,
    green: totalNumbers > 0 ? Math.round((greenCount / totalNumbers) * 100) : 0
  };
};
