import { useState } from 'react';
import { useLocation } from 'wouter';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Loader2, Wallet } from 'lucide-react';

// Schemas de validação
const loginSchema = z.object({
  username: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Login Page Component
const Login = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { connect, isConnected, isConnecting } = useWallet();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirecionar se já estiver logado
  if (isConnected) {
    setLocation('/dashboard');
    return null;
  }

  // Form de login com React Hook Form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Função para conectar via carteira
  const handleConnectWallet = async (type: string) => {
    try {
      await connect(type);
      toast({
        title: 'Carteira conectada com sucesso',
        description: 'Você será redirecionado para o dashboard.',
      });
      
      // Dar tempo para a toast aparecer antes de redirecionar
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1000);
    } catch (error) {
      toast({
        title: 'Erro ao conectar carteira',
        description: 'Tente novamente ou use outro método de conexão.',
        variant: 'destructive',
      });
    }
  };

  // Função para login tradicional
  const handleLoginSubmit = async (data: LoginFormValues) => {
    setIsLoggingIn(true);
    
    try {
      // Simulação de chamada de API para login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Exemplo de verificação (deve ser substituído por chamada real à API)
      if (data.username === 'admin' && data.password === 'password') {
        toast({
          title: 'Login realizado com sucesso',
          description: 'Bem-vindo de volta!',
        });
        
        // Dar tempo para a toast aparecer antes de redirecionar
        setTimeout(() => {
          setLocation('/dashboard');
        }, 1000);
      } else {
        toast({
          title: 'Erro ao fazer login',
          description: 'Usuário ou senha incorretos.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        description: 'Ocorreu um erro ao tentar fazer login.',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">Acesse o Dashboard</CardTitle>
          <CardDescription>
            Faça login para gerenciar seus NFT Gift Cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="wallet" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="wallet">Carteira Web3</TabsTrigger>
              <TabsTrigger value="credentials">Login/Senha</TabsTrigger>
            </TabsList>
            
            {/* Login com Carteira Web3 */}
            <TabsContent value="wallet" className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-center text-muted-foreground">
                  Conecte sua carteira para acessar seu dashboard de NFT Gift Cards
                </p>
                
                <div className="grid gap-3 pt-4">
                  <Button 
                    className="w-full" 
                    onClick={() => handleConnectWallet('metamask')}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Conectar com MetaMask
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleConnectWallet('walletconnect')}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Conectar com WalletConnect
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-center text-muted-foreground">
                <p>
                  Não tem uma carteira Web3?{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={() => document.querySelector('[data-value="credentials"]')?.click()}>
                    Use login e senha
                  </Button>
                </p>
              </div>
            </TabsContent>
            
            {/* Login com Credenciais */}
            <TabsContent value="credentials" className="py-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome de Usuário</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite seu usuário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Digite sua senha" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-sm text-center text-muted-foreground">
                <p>
                  Prefere usar sua carteira?{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={() => document.querySelector('[data-value="wallet"]')?.click()}>
                    Conectar carteira
                  </Button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;