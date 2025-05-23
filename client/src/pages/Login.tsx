import { useState } from 'react';
import { useLocation } from 'wouter';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('wallet');
  const [_, setLocation] = useLocation();
  const { connect, isConnected, isConnecting } = useWallet();

  const handleWalletConnect = async () => {
    try {
      await connect('metamask');
      setTimeout(() => {
        setLocation('/dashboard');
      }, 500);
    } catch (error) {
      setError('Falha ao conectar carteira. Tente novamente.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Verificar credenciais
      if (username === 'admin' && password === '123') {
        // Admin login
        localStorage.setItem('user_role', 'admin');
        localStorage.setItem('user_authenticated', 'true');
        setTimeout(() => {
          setLocation('/admin');
        }, 500);
      } else if (username === 'usuario' && password === '123') {
        // User login
        localStorage.setItem('user_role', 'user');
        localStorage.setItem('user_authenticated', 'true');
        setTimeout(() => {
          setLocation('/dashboard');
        }, 500);
      } else {
        setError('Credenciais inválidas. Tente novamente.');
      }
    } catch (error) {
      setError('Erro no login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar se o usuário já está autenticado
  if (isConnected) {
    setLocation('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">NFTGift Cards</CardTitle>
          <CardDescription>
            Entre na sua conta para gerenciar seus gift cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="wallet" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="wallet">Conectar Carteira</TabsTrigger>
              <TabsTrigger value="credentials">Credenciais</TabsTrigger>
            </TabsList>
            
            <TabsContent value="wallet" className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Conecte sua carteira Web3 para acessar a plataforma
                </p>
                
                <Button 
                  onClick={handleWalletConnect} 
                  className="w-full h-14"
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>Conectar Carteira</>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Ao conectar, você concorda com os termos e condições da plataforma
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="credentials" className="space-y-4">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário</Label>
                    <Input 
                      id="username"
                      placeholder="Digite seu usuário" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Senha</Label>
                      <Button variant="link" size="sm" className="p-0 h-auto text-xs">
                        Esqueceu a senha?
                      </Button>
                    </div>
                    <Input 
                      id="password"
                      type="password" 
                      placeholder="Digite sua senha" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>Entrar</>
                    )}
                  </Button>
                </div>
              </form>
              
              <div className="mt-4 text-center text-sm">
                <p className="text-xs text-muted-foreground">
                  Admin - Usuário: admin / Senha: 123<br />
                  Usuário - Usuário: usuario / Senha: 123
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Não tem uma conta?{' '}
            </span>
            <Button variant="link" className="p-0 h-auto" onClick={() => setLocation('/')}>
              Crie uma agora
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;