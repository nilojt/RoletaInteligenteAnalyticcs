import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RouletteNumber from "./RouletteNumber";
import { Round } from "@shared/schema";
import { calculateRoundStats, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface HistoryPanelProps {
  rounds: Round[];
  onClearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ rounds, onClearHistory }) => {
  const { toast } = useToast();

  const handleClearHistory = () => {
    if (rounds.length === 0) {
      toast({
        title: "Histórico vazio",
        description: "Não há rodadas para limpar.",
        variant: "destructive"
      });
      return;
    }
    
    onClearHistory();
  };

  return (
    <Card className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg h-full">
      <div className="p-4 bg-gradient-to-r from-primary to-secondary">
        <h2 className="text-xl font-bold font-montserrat text-white flex items-center">
          <i className="fas fa-history mr-2"></i>
          Histórico de Rodadas
        </h2>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between mb-4 items-center">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-medium">{rounds.length}</span> rodadas registradas
          </p>
          <button 
            className="text-accent hover:text-accent-dark transition-colors flex items-center"
            onClick={handleClearHistory}
          >
            <i className="fas fa-trash-alt mr-1"></i>
            <span className="text-sm">Limpar histórico</span>
          </button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-15rem)] scrollbar-custom pr-2">
          {rounds.length > 0 ? (
            rounds.map((round, index) => {
              const stats = calculateRoundStats(round.numbers);
              return (
                <div key={`round-${index}`} className="mb-4 round-container pl-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Rodada {rounds.length - index}</h3>
                    <span className="text-xs text-gray-400">
                      {formatDate(round.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap mb-3">
                    {round.numbers.map((num, numIndex) => (
                      <RouletteNumber 
                        key={`round-${index}-number-${numIndex}`} 
                        number={num} 
                      />
                    ))}
                  </div>
                  
                  <div className="flex text-xs text-gray-400">
                    <div className="mr-3">
                      <i className="fas fa-bullseye mr-1 text-primary"></i>
                      Pares: <span>{stats.evens}</span>
                    </div>
                    <div className="mr-3">
                      <i className="fas fa-bullseye mr-1 text-secondary"></i>
                      Vermelhos: <span>{stats.reds}</span>
                    </div>
                    <div>
                      <i className="fas fa-random mr-1 text-accent"></i>
                      Seq. máx: <span>{stats.maxSequence}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-400 text-center py-6">
              <i className="fas fa-history text-4xl mb-3 opacity-30"></i>
              <p>Nenhuma rodada registrada</p>
              <p className="text-sm mt-2">Registre rodadas usando o painel de entrada manual</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryPanel;
