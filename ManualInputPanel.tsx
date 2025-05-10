import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import RouletteNumber from "./RouletteNumber";
import { rouletteNumbers } from "@/lib/rouletteData";
import { Round } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ManualInputPanelProps {
  onRoundComplete: (numbers: number[]) => void;
}

const ManualInputPanel: React.FC<ManualInputPanelProps> = ({ onRoundComplete }) => {
  const [currentRound, setCurrentRound] = useState<number[]>([]);
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  const startNewRound = () => {
    if (isActive) {
      toast({
        title: "Rodada em andamento",
        description: "Finalize ou limpe a rodada atual antes de iniciar uma nova.",
        variant: "destructive"
      });
      return;
    }
    
    setIsActive(true);
    
    toast({
      title: "Nova rodada iniciada",
      description: "Selecione os números conforme eles são sorteados.",
    });
  };

  const finalizeRound = () => {
    if (!isActive) {
      toast({
        title: "Nenhuma rodada ativa",
        description: "Inicie uma nova rodada primeiro.",
        variant: "destructive"
      });
      return;
    }

    if (currentRound.length === 0) {
      toast({
        title: "Rodada vazia",
        description: "Adicione pelo menos um número antes de finalizar a rodada.",
        variant: "destructive"
      });
      return;
    }

    onRoundComplete([...currentRound]);
    setIsActive(false);
    
    toast({
      title: "Rodada finalizada",
      description: `${currentRound.length} números registrados com sucesso.`,
    });
  };

  const addNumberToRound = (number: number) => {
    if (!isActive) {
      toast({
        title: "Nenhuma rodada ativa",
        description: "Inicie uma nova rodada primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    setCurrentRound(prev => [...prev, number]);
  };

  const undoLastNumber = () => {
    if (currentRound.length === 0) return;
    setCurrentRound(prev => prev.slice(0, -1));
  };

  const clearRound = () => {
    setCurrentRound([]);
    if (isActive) {
      setIsActive(false);
      toast({
        title: "Rodada cancelada",
        description: "A rodada atual foi limpa e cancelada.",
      });
    }
  };

  return (
    <Card className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 bg-gradient-to-r from-primary to-secondary">
        <h2 className="text-xl font-bold font-montserrat text-white flex items-center">
          <i className="fas fa-keyboard mr-2"></i>
          Entrada Manual
        </h2>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between mb-4">
          <Button 
            variant="secondary" 
            className="flex-1 mr-2"
            onClick={startNewRound}
          >
            <i className="fas fa-play-circle mr-2"></i>
            Nova Rodada
          </Button>
          <Button 
            className="flex-1 ml-2" 
            onClick={finalizeRound}
          >
            <i className="fas fa-check-circle mr-2"></i>
            Finalizar Rodada
          </Button>
        </div>
        
        <div className="bg-[#121212] rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-400 mb-2">Rodada atual:</p>
          <div className="flex flex-wrap">
            {currentRound.map((num, index) => (
              <RouletteNumber key={`current-${index}`} number={num} />
            ))}
            {currentRound.length === 0 && (
              <span className="text-gray-500 text-sm italic">Nenhum número selecionado</span>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-400 mb-2">Selecione os números na sequência do sorteio:</p>
        
        <div className="grid grid-cols-6 gap-1 mb-4">
          {rouletteNumbers.map((numObj) => (
            <RouletteNumber 
              key={`select-${numObj.number}`} 
              number={numObj.number} 
              onClick={addNumberToRound}
            />
          ))}
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            className="flex-1 mr-2" 
            onClick={undoLastNumber}
          >
            <i className="fas fa-undo mr-2"></i>
            Desfazer
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 ml-2" 
            onClick={clearRound}
          >
            <i className="fas fa-trash-alt mr-2"></i>
            Limpar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManualInputPanel;
