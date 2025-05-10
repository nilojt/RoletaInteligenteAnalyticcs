import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AlgorithmInfo: React.FC = () => {
  return (
    <Card className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg">
      <div className="p-4 bg-[#2d2d2d]">
        <h2 className="text-lg font-bold font-montserrat text-white flex items-center">
          <i className="fas fa-info-circle mr-2"></i>
          Sobre a Análise
        </h2>
      </div>
      
      <CardContent className="p-4 text-sm text-gray-300">
        <p className="mb-2">Nosso algoritmo avançado analisa:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Frequência dos números nas últimas rodadas</li>
          <li>Padrões complexos de repetição e sequências</li>
          <li>"Vizinhos" na roda da roleta europeia</li>
          <li>Posições mais frequentes dos números</li>
          <li>Tendências de cores e paridade</li>
        </ul>
        <p className="mt-3 text-xs text-gray-400">
          * O número destacado com ⭐ tem a maior probabilidade de acordo com o algoritmo. Dê preferência a ele.
        </p>
        <p className="mt-1 text-xs text-gray-400">
          * As previsões são baseadas em análise estatística avançada, mas não garantem resultados.
        </p>
      </CardContent>
    </Card>
  );
};

export default AlgorithmInfo;
