import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu } from "lucide-react";

const Header: React.FC = () => {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-[#1e1e1e] border-b border-[#2d2d2d] py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="mr-2 text-accent text-2xl">
              <i className="fas fa-dice"></i>
            </div>
            <h1 className="text-2xl font-bold font-montserrat text-white">
              <span className="text-primary">Roleta</span> Inteligente <span className="text-accent">BR</span>
            </h1>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <div className="text-white mr-2 flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">{user.username}</span>
                {user.isAdmin && (
                  <span className="ml-2 bg-primary text-xs px-2 py-0.5 rounded-full text-white">
                    Admin
                  </span>
                )}
              </div>
              {user.isAdmin && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mr-2"
                  onClick={() => navigate("/admin")}
                >
                  <i className="fas fa-users-cog mr-2"></i>
                  Admin
                </Button>
              )}
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button 
                className="bg-primary hover:bg-opacity-80" 
                onClick={() => navigate("/auth")}
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Entrar
              </Button>
              <Button 
                variant="outline" 
                className="bg-[#2d2d2d]"
                onClick={() => {
                  navigate("/auth");
                  // Delay to allow page to load before switching tab
                  setTimeout(() => {
                    const registerTab = document.querySelector('[value="register"]');
                    if (registerTab) {
                      (registerTab as HTMLElement).click();
                    }
                  }, 100);
                }}
              >
                <i className="fas fa-user-plus mr-2"></i>
                Registrar
              </Button>
            </>
          )}
        </div>
        
        <div className="md:hidden">
          <button className="text-white text-xl">
            <Menu />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
