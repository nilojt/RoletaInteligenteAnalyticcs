import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RouletteNumber from "./RouletteNumber";
import StatisticsPanel from "./StatisticsPanel";
import { Round, Prediction } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface PredictionPanelProps {
  rounds: Round[];
  predictedNumbers: number[];
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({ 
  rounds, 
  predictedNumbers, 
  onAnalyze,
  isAnalyzing
}) => {
  const { toast } = useToast();

  const handleAnalyzeClick = () => {
    if (rounds.length === 0) {
      toast({
        title: "Sem dados suficientes",
        description: "Registre pelo menos uma rodada completa antes de analisar.",
        variant: "destructive"
      });
      return;
    }
    
    onAnalyze();
  };

  return (
    <Card className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 bg-gradient-to-r from-primary to-secondary">
        <h2 className="text-xl font-bold font-montserrat text-white flex items-center">
          <i className="fas fa-chart-line mr-2"></i>
          Previsões
        </h2>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-accent mb-4 font-montserrat text-center">
            5 Números Mais Prováveis
          </h3>
          
          <div className="flex justify-center mb-6">
            {predictedNumbers.length > 0 ? (
              predictedNumbers.map((num, index) => (
                <div key={`predict-${index}`} className="predicted-number flex flex-col items-center mx-1">
                  <div className="text-xs text-white mb-1 font-bold">
                    {index === 0 ? '⭐ Principal' : `#${index+1}`}
                  </div>
                  <RouletteNumber number={num} size="lg" className="transform-none shadow-md" />
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">
                Clique em "Analisar Agora" para gerar previsões
              </div>
            )}
          </div>
          
          <Button
            className="bg-accent hover:bg-opacity-80 text-[#121212] font-bold w-full h-12"
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="border-2 border-[#121212] border-t-transparent rounded-full w-5 h-5 animate-spin mr-2"></div>
                Analisando...
              </>
            ) : (
              <>
                <i className="fas fa-magic mr-2"></i>
                Analisar Agora
              </>
            )}
          </Button>
        </div>
        
        <StatisticsPanel rounds={rounds} />
      </CardContent>
    </Card>
  );
};

export default PredictionPanel;
