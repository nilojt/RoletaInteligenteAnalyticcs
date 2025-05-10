import React from "react";
import RouletteNumber from "./RouletteNumber";
import { Round } from "@shared/schema";
import { getHotNumbers, getColdNumbers, getParityStats, getColorStats } from "@/lib/rouletteData";
import { Progress } from "@/components/ui/progress";

interface StatisticsPanelProps {
  rounds: Round[];
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ rounds }) => {
  // Get statistics
  const hotNumbers = getHotNumbers(rounds, 3);
  const coldNumbers = getColdNumbers(rounds, 3);
  const parityStats = getParityStats(rounds);
  const colorStats = getColorStats(rounds);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-2 font-montserrat">Estatísticas Atuais</h3>
      
      <div className="bg-[#121212] rounded-lg p-4">
        <h4 className="text-secondary text-sm mb-2">Números Quentes</h4>
        <div className="flex flex-wrap">
          {hotNumbers.length > 0 ? (
            hotNumbers.map((num) => (
              <RouletteNumber key={`hot-${num}`} number={num} />
            ))
          ) : (
            <span className="text-gray-500 text-sm italic">Sem dados suficientes</span>
          )}
        </div>
      </div>
      
      <div className="bg-[#121212] rounded-lg p-4">
        <h4 className="text-secondary text-sm mb-2">Números Frios</h4>
        <div className="flex flex-wrap">
          {coldNumbers.length > 0 ? (
            coldNumbers.map((num) => (
              <RouletteNumber key={`cold-${num}`} number={num} />
            ))
          ) : (
            <span className="text-gray-500 text-sm italic">Sem dados suficientes</span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#121212] rounded-lg p-4">
          <h4 className="text-secondary text-sm mb-2">Paridade</h4>
          <div className="h-24 relative overflow-hidden rounded-lg">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Ímpares</span>
                <span>{parityStats.odd}%</span>
              </div>
              <Progress value={parityStats.odd} className="h-3 bg-[#2d2d2d]" />
              
              <div className="flex justify-between text-xs mb-1">
                <span>Pares</span>
                <span>{parityStats.even}%</span>
              </div>
              <Progress value={parityStats.even} className="h-3 bg-[#2d2d2d]" indicatorClassName="bg-secondary" />
            </div>
          </div>
        </div>
        
        <div className="bg-[#121212] rounded-lg p-4">
          <h4 className="text-secondary text-sm mb-2">Cores</h4>
          <div className="h-24 relative overflow-hidden rounded-lg">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Vermelho</span>
                <span>{colorStats.red}%</span>
              </div>
              <Progress value={colorStats.red} className="h-3 bg-[#2d2d2d]" indicatorClassName="bg-primary" />
              
              <div className="flex justify-between text-xs mb-1">
                <span>Preto</span>
                <span>{colorStats.black}%</span>
              </div>
              <Progress value={colorStats.black} className="h-3 bg-[#2d2d2d]" />
              
              <div className="flex justify-between text-xs mb-1">
                <span>Verde</span>
                <span>{colorStats.green}%</span>
              </div>
              <Progress value={colorStats.green} className="h-3 bg-[#2d2d2d]" indicatorClassName="bg-[#4caf50]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
