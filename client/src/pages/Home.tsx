import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import CallToAction from "@/components/CallToAction";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2 } from "lucide-react";

interface HomeProps {
  openWalletModal?: () => void;
}

const Home = ({ openWalletModal }: HomeProps = {}) => {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    document.title = "NFTGift - Gift Cards Reimagined with NFT Technology";
    
    // Verificar se o usuário já estava logado como admin
    const isAdmin = localStorage.getItem('user_role') === 'admin';
    const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
    if (isAdmin && isAuthenticated) {
      // Permitir acesso rápido ao admin se ele já estiver autenticado previamente
      const fastAccessButton = document.createElement('button');
      fastAccessButton.innerHTML = `
        <div class="fixed bottom-4 right-4 bg-primary text-white rounded-full p-3 shadow-lg z-50 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 10-4 4-4-4"/></svg>
          <span class="font-medium">Painel Admin</span>
        </div>
      `;
      document.body.appendChild(fastAccessButton);
      fastAccessButton.onclick = () => setLocation('/admin');
    }
  }, [setLocation]);

  // Fallback para o caso de openWalletModal não ser passado
  const handleOpenWallet = () => {
    if (openWalletModal) {
      openWalletModal();
    } else {
      toast({
        title: "Connect Wallet",
        description: "Please use the Connect Wallet button in the header.",
      });
    }
  };

  const handleDirectAdminAccess = () => {
    setShowAdminDialog(true);
  };

  const handleAdminLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Verificar a senha de admin
      if (adminPassword === '123') {
        // Salvar credenciais e redirecionar
        localStorage.setItem('user_role', 'admin');
        localStorage.setItem('user_authenticated', 'true');
        localStorage.setItem('username', 'admin');
        
        toast({
          title: "Login de Administrador",
          description: "Bem-vindo ao painel administrativo!",
        });
        
        setTimeout(() => {
          setShowAdminDialog(false);
          setLocation('/admin');
        }, 500);
      } else {
        setError('Senha de administrador incorreta');
      }
    } catch (error) {
      setError('Ocorreu um erro no login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Hero />
      <FeaturesSection />
      <CallToAction openWalletModal={handleOpenWallet} />
      
      {/* Botão de acesso rápido para Admin */}
      <div 
        className="fixed bottom-4 left-4 bg-primary/10 text-primary backdrop-blur-sm border border-primary/20 rounded-full p-2 shadow-lg cursor-pointer hover:bg-primary/20 transition-colors duration-200"
        onClick={handleDirectAdminAccess}
      >
        <Shield size={24} />
      </div>
      
      {/* Dialog de acesso rápido para Admin */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Acesso de Administrador
            </DialogTitle>
            <DialogDescription>
              Digite a senha de administrador para acessar o painel completo.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Senha de Admin</Label>
              <Input 
                id="adminPassword"
                type="password"
                placeholder="Digite a senha de admin" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <p className="text-xs text-muted-foreground mt-1">
                Dica: A senha é "123"
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAdminDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAdminLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>Acessar Painel</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
