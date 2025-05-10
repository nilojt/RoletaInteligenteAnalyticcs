import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface RouletteViewerProps {
  onReload: () => void;
}

const RouletteViewer: React.FC<RouletteViewerProps> = ({ onReload }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleReload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onReload();
    }, 1500);
  };

  return (
    <Card className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 bg-gradient-to-r from-primary to-secondary">
        <h2 className="text-xl font-bold font-montserrat text-white flex items-center">
          <i className="fas fa-broadcast-tower mr-2"></i>
          Roleta ao Vivo
        </h2>
      </div>
      
      <CardContent className="p-4">
        <div className="relative bg-[#121212] rounded-lg overflow-hidden">
          {/* Full height iframe for BetLandia */}
          <div className="h-[600px] w-full">
            <iframe 
              src="https://betlandia.online/register?code=277Q9008JD" 
              className="w-full h-full border-0"
              title="BetLandia Roleta"
              sandbox="allow-scripts allow-same-origin allow-forms"
              loading="lazy"
              referrerPolicy="no-referrer"
            ></iframe>
            
            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                <div className="border-4 border-gray-300 border-t-primary rounded-full w-10 h-10 animate-spin mb-4"></div>
                <p className="text-white font-medium">Carregando roleta...</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button 
            className="bg-primary hover:bg-opacity-80 px-4 py-2 rounded-md text-white font-medium transition-all w-full"
            onClick={handleReload}
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Recarregar Roleta
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouletteViewer;
