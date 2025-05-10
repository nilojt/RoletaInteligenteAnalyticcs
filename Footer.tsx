import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1e1e1e] py-6 border-t border-[#2d2d2d]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Roleta Inteligente BR - BetLandia. Todos os direitos reservados.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-whatsapp"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-telegram"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>Este site é apenas para fins de entretenimento. Jogue com responsabilidade.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
