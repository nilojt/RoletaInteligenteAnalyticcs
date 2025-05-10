import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RouletteViewer from "@/components/RouletteViewer";
import ManualInputPanel from "@/components/ManualInputPanel";
import PredictionPanel from "@/components/PredictionPanel";
import HistoryPanel from "@/components/HistoryPanel";
import AlgorithmInfo from "@/components/AlgorithmInfo";
import { Round } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { predictNextNumbers } from "@/lib/predictAlgorithm";
import { loadRoundsFromStorage, saveRoundsToStorage } from "@/lib/rouletteData";
import { useToast } from "@/hooks/use-toast";

const Home: React.FC = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [predictedNumbers, setPredictedNumbers] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Fetch rounds from server
  const { data: fetchedRounds, refetch } = useQuery<Round[]>({
    queryKey: ['/api/rounds'],
    onError: () => {
      // If server fetch fails, load from local storage
      const storedRounds = loadRoundsFromStorage();
      setRounds(storedRounds);
      
      toast({
        title: "Erro ao carregar dados do servidor",
        description: "Usando dados armazenados localmente.",
        variant: "destructive"
      });
    },
    onSuccess: (data) => {
      setRounds(data);
      // Save to local storage as backup
      saveRoundsToStorage(data);
    }
  });

  useEffect(() => {
    if (fetchedRounds) {
      setRounds(fetchedRounds);
    }
  }, [fetchedRounds]);

  // Mutation to save a new round
  const { mutate: saveRound } = useMutation({
    mutationFn: async (numbers: number[]) => {
      try {
        const response = await apiRequest('POST', '/api/rounds', { numbers });
        const newRound = await response.json();
        return newRound;
      } catch (error) {
        // If server save fails, save locally
        const newRound: Round = {
          id: Math.random(),
          numbers,
          timestamp: new Date()
        };
        
        const updatedRounds = [newRound, ...rounds].slice(0, 20);
        setRounds(updatedRounds);
        saveRoundsToStorage(updatedRounds);
        
        throw new Error('Failed to save to server, saved locally instead');
      }
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Rodada salva",
        description: "A rodada foi registrada com sucesso.",
      });
    },
    onError: (error) => {
      if (error.message.includes('saved locally')) {
        toast({
          title: "Salvo localmente",
          description: "A rodada foi salva apenas localmente devido a um erro de conexão.",
          variant: "default"
        });
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar a rodada.",
          variant: "destructive"
        });
      }
    }
  });

  // Mutation to clear history
  const { mutate: clearHistory } = useMutation({
    mutationFn: async () => {
      try {
        await apiRequest('DELETE', '/api/rounds');
      } catch (error) {
        // If server clear fails, clear locally
        setRounds([]);
        saveRoundsToStorage([]);
        throw new Error('Failed to clear on server, cleared locally instead');
      }
    },
    onSuccess: () => {
      refetch();
      setPredictedNumbers([]);
      toast({
        title: "Histórico limpo",
        description: "Todas as rodadas foram removidas.",
      });
    },
    onError: (error) => {
      if (error.message.includes('cleared locally')) {
        toast({
          title: "Limpo localmente",
          description: "O histórico foi limpo apenas localmente devido a um erro de conexão.",
          variant: "default"
        });
      } else {
        toast({
          title: "Erro ao limpar",
          description: "Não foi possível limpar o histórico.",
          variant: "destructive"
        });
      }
    }
  });

  const handleRoundComplete = (numbers: number[]) => {
    saveRound(numbers);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time (for better UX)
    setTimeout(() => {
      const prediction = predictNextNumbers(rounds);
      setPredictedNumbers(prediction.numbers);
      setIsAnalyzing(false);
      
      toast({
        title: "Análise completa",
        description: "Os 5 números mais prováveis para a próxima rodada foram calculados.",
      });
    }, 2000);
  };

  const handleReloadRouletteViewer = () => {
    toast({
      title: "Roleta recarregada",
      description: "A visualização da roleta foi atualizada.",
    });
  };

  const handleClearHistory = () => {
    clearHistory();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow p-4 md:p-6">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left column (Iframe and manual input) */}
          <div className="lg:col-span-4 space-y-6">
            <RouletteViewer onReload={handleReloadRouletteViewer} />
            <ManualInputPanel onRoundComplete={handleRoundComplete} />
          </div>
          
          {/* Middle column (Predictions) */}
          <div className="lg:col-span-4 space-y-6">
            <PredictionPanel 
              rounds={rounds} 
              predictedNumbers={predictedNumbers}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
            <AlgorithmInfo />
          </div>
          
          {/* Right column (History) */}
          <div className="lg:col-span-4 space-y-6">
            <HistoryPanel 
              rounds={rounds}
              onClearHistory={handleClearHistory}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
