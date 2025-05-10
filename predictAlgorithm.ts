import { Round, Prediction } from "@shared/schema";
import { getNumberFrequencies, getColorStats, getParityStats } from "./rouletteData";
import { getNumberColor } from "./utils";

// Weight configuration for the prediction algorithm
interface PredictionWeights {
  frequency: number;       // Weight for overall frequency
  recentFrequency: number; // Weight for frequency in recent rounds
  colorTrend: number;      // Weight for color trends
  parityTrend: number;     // Weight for parity trends
  patterns: number;        // Weight for pattern detection
}

const DEFAULT_WEIGHTS: PredictionWeights = {
  frequency: 0.20,      // Reduzido para dar menos peso à frequência geral
  recentFrequency: 0.40, // Aumentado para dar mais peso às tendências recentes
  colorTrend: 0.15,      // Mantido
  parityTrend: 0.10,     // Reduzido
  patterns: 0.15        // Aumentado para dar mais peso aos padrões detectados
};

// Predict the next 5 most likely numbers based on historical data
export const predictNextNumbers = (rounds: Round[], count: number = 5): Prediction => {
  // If there's not enough data, return random numbers
  if (rounds.length < 2) {
    return {
      numbers: generateRandomNumbers(count),
      timestamp: new Date()
    };
  }

  // Get the frequencies of all numbers from all rounds
  const overallFrequencies = getNumberFrequencies(rounds);
  
  // Get the frequencies from recent rounds (last 5 or fewer)
  const recentRounds = rounds.slice(0, Math.min(5, rounds.length));
  const recentFrequencies = getNumberFrequencies(recentRounds);

  // Get color and parity statistics
  const colorStats = getColorStats(rounds);
  const parityStats = getParityStats(rounds);

  // Calculate scores for each number
  const scores = new Map<number, number>();
  
  for (let num = 0; num <= 36; num++) {
    let score = 0;
    
    // Factor 1: Overall frequency
    const overallFreq = overallFrequencies.get(num) || 0;
    const maxOverallFreq = Math.max(...Array.from(overallFrequencies.values()));
    const normalizedOverallFreq = maxOverallFreq > 0 ? overallFreq / maxOverallFreq : 0;
    score += normalizedOverallFreq * DEFAULT_WEIGHTS.frequency;
    
    // Factor 2: Recent frequency
    const recentFreq = recentFrequencies.get(num) || 0;
    const maxRecentFreq = Math.max(...Array.from(recentFrequencies.values()));
    const normalizedRecentFreq = maxRecentFreq > 0 ? recentFreq / maxRecentFreq : 0;
    score += normalizedRecentFreq * DEFAULT_WEIGHTS.recentFrequency;
    
    // Factor 3: Color trend
    const numColor = getNumberColor(num);
    let colorBonus = 0;
    if (numColor === 'red' && colorStats.red > colorStats.black) {
      colorBonus = colorStats.red / 100;
    } else if (numColor === 'black' && colorStats.black > colorStats.red) {
      colorBonus = colorStats.black / 100;
    } else if (numColor === 'green') {
      colorBonus = colorStats.green / 100;
    }
    score += colorBonus * DEFAULT_WEIGHTS.colorTrend;
    
    // Factor 4: Parity trend
    let parityBonus = 0;
    if (num !== 0) {
      if (num % 2 === 0 && parityStats.even > parityStats.odd) {
        parityBonus = parityStats.even / 100;
      } else if (num % 2 !== 0 && parityStats.odd > parityStats.even) {
        parityBonus = parityStats.odd / 100;
      }
    }
    score += parityBonus * DEFAULT_WEIGHTS.parityTrend;
    
    // Factor 5: Pattern detection (melhorado)
    // Procura padrões mais complexos e sequências
    let patternBonus = 0;
    
    // Verifica padrões de repetição nos últimos jogos
    for (let i = 1; i < rounds.length; i++) {
      const currentRound = rounds[i].numbers;
      const previousRound = rounds[i-1].numbers;
      
      // Verifica se este número apareceu após outro número específico
      for (let j = 0; j < previousRound.length; j++) {
        if (previousRound[j] === currentRound[0] && 
            currentRound.includes(num)) {
          patternBonus += 0.25; // Aumentado para dar mais importância
        }
      }
      
      // Verifica se este número aparece frequentemente no mesmo índice
      const roundsWithNum = rounds.filter(r => r.numbers.includes(num));
      if (roundsWithNum.length >= 2) {
        // Se aparecer na mesma posição em várias rodadas
        const positionCounts = new Array(5).fill(0);
        for (const r of roundsWithNum) {
          const index = r.numbers.indexOf(num);
          if (index >= 0 && index < 5) {
            positionCounts[index]++;
          }
        }
        const maxPositionCount = Math.max(...positionCounts);
        if (maxPositionCount >= 2) {
          patternBonus += 0.3;
        }
      }
      
      // Verifica números "vizinhos" na roda da roleta (números próximos)
      // Números adjacentes na roleta europeia
      const rouletteNeighbors: { [key: number]: number[] } = {
        0: [3, 26], 1: [20, 14], 2: [21, 25], 3: [0, 35], 
        4: [15, 19], 5: [10, 24], 6: [27, 13], 7: [36, 18], 
        8: [23, 10], 9: [22, 18], 10: [5, 8], 11: [30, 36], 
        12: [35, 3], 13: [6, 27], 14: [1, 20], 15: [4, 19], 
        16: [33, 1], 17: [34, 6], 18: [7, 9], 19: [4, 15], 
        20: [1, 14], 21: [2, 25], 22: [9, 18], 23: [8, 10], 
        24: [5, 16], 25: [2, 21], 26: [0, 32], 27: [6, 13], 
        28: [12, 35], 29: [7, 28], 30: [11, 36], 31: [33, 16], 
        32: [26, 0], 33: [16, 31], 34: [17, 6], 35: [3, 12], 
        36: [7, 30]
      };
      
      // Verifica se números vizinhos apareceram recentemente
      const neighbors = rouletteNeighbors[num] || [];
      for (const neighbor of neighbors) {
        if (recentFrequencies.has(neighbor)) {
          patternBonus += 0.15;
        }
      }
    }
    
    score += Math.min(patternBonus, 1.5) * DEFAULT_WEIGHTS.patterns;
    
    scores.set(num, score);
  }
  
  // Sort numbers by score and get the top 'count'
  const predictedNumbers = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(entry => entry[0]);
  
  return {
    numbers: predictedNumbers,
    timestamp: new Date()
  };
};

// Helper function to generate random numbers (used when insufficient data)
function generateRandomNumbers(count: number): number[] {
  const result: number[] = [];
  while (result.length < count) {
    const num = Math.floor(Math.random() * 37); // 0-36
    if (!result.includes(num)) {
      result.push(num);
    }
  }
  return result;
}
