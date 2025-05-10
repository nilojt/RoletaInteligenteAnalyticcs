import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', ' -');
}

export const getNumberColor = (num: number): 'red' | 'black' | 'green' => {
  if (num === 0) return 'green';
  
  // Red numbers in European roulette
  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 
    21, 23, 25, 27, 30, 32, 34, 36
  ];
  
  return redNumbers.includes(num) ? 'red' : 'black';
};

export const getNumberClassName = (num: number): string => {
  const color = getNumberColor(num);
  switch (color) {
    case 'red':
      return 'red-number';
    case 'black':
      return 'black-number';
    case 'green':
      return 'green-number';
  }
};

// Calculate round statistics
export const calculateRoundStats = (numbers: number[]): { evens: number, reds: number, maxSequence: number } => {
  // Count even numbers
  const evens = numbers.filter(num => num !== 0 && num % 2 === 0).length;
  
  // Count red numbers
  const reds = numbers.filter(num => getNumberColor(num) === 'red').length;
  
  // Find max sequence of same color
  let maxSequence = 0;
  let currentSequence = 1;
  
  for (let i = 1; i < numbers.length; i++) {
    if (getNumberColor(numbers[i]) === getNumberColor(numbers[i-1])) {
      currentSequence++;
    } else {
      maxSequence = Math.max(maxSequence, currentSequence);
      currentSequence = 1;
    }
  }
  
  maxSequence = Math.max(maxSequence, currentSequence);
  
  return { evens, reds, maxSequence };
};
