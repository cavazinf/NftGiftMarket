import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { 
  Wallet, Shield, Key, CheckCircle, ArrowRight, 
  Fingerprint, QrCode, Smartphone, Lock,
  UserCheck, AlertTriangle, Sparkles
} from 'lucide-react';

interface NFTAuth {
  id: string;
  name: string;
  image: string;
  contractAddress: string;
  tokenId: string;
  verified: boolean;
  accessLevel: 'basic' | 'premium' | 'vip';
}

const NFTLogin = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { isConnected, connect, walletAddress } = useWallet();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [userNFTs, setUserNFTs] = useState<NFTAuth[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFTAuth | null>(null);
  const [authCode, setAuthCode] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mock NFTs para demonstração
  const mockNFTs: NFTAuth[] = [
    {
      id: '1',
      name: 'Premium Access Card',
      image: 'https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=Premium',
      contractAddress: '0x1234...abcd',
      tokenId: '001',
      verified: true,
      accessLevel: 'premium'
    },
    {
      id: '2', 
      name: 'VIP Membership NFT',
      image: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=VIP',
      contractAddress: '0x5678...efgh',
      tokenId: '025',
      verified: true,
      accessLevel: 'vip'
    },
    {
      id: '3',
      name: 'Basic User Token',
      image: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=Basic',
      contractAddress: '0x9abc...ijkl',
      tokenId: '142',
      verified: false,
      accessLevel: 'basic'
    }
  ];

  // Conectar carteira
  const handleWalletConnect = async (walletType: string) => {
    setSelectedWallet(walletType);
    try {
      await connect(walletType);
      // Simular busca de NFTs
      setTimeout(() => {
        setUserNFTs(mockNFTs);
        setCurrentStep(2);
        toast({
          title: 'Carteira conectada!',
          description: `${mockNFTs.length} NFTs encontrados para autenticação.`
        });
      }, 1500);
    } catch (error) {
      toast({
        title: 'Erro de conexão',
        description: 'Não foi possível conectar a carteira.',
        variant: 'destructive'
      });
    }
  };

  // Solicitar login com NFT
  const handleNFTSelect = (nft: NFTAuth) => {
    setSelectedNFT(nft);
    setCurrentStep(3);
    
    // Simular geração de código de autenticação
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setAuthCode(code);
    
    toast({
      title: 'NFT selecionado!',
      description: `Código de autenticação gerado: ${code}`
    });
  };

  // Login social (Google, Facebook)
  const handleSocialLogin = async (provider: string) => {
    setIsAuthenticating(true);
    
    // Simular login social
    setTimeout(() => {
      // Para usuários Web2, pular direto para autenticação 2FA
      setCurrentStep(3);
      setIsAuthenticating(false);
      
      // Simular que o usuário tem NFTs associados à conta social
      setUserNFTs(mockNFTs.slice(0, 2)); // Mostrar apenas alguns NFTs
      
      toast({
        title: `Login com ${provider} realizado!`,
        description: `${mockNFTs.slice(0, 2).length} NFTs encontrados na sua conta.`
      });
    }, 1500);
  };

  // Mostrar formulário de email
  const handleEmailLogin = () => {
    setShowEmailForm(true);
  };

  // Processar login por email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsAuthenticating(true);
    
    // Verificar credenciais de admin
    if (email.toLowerCase() === 'admin' && password === '123') {
      setTimeout(() => {
        setCurrentStep(4); // Pular direto para acesso autorizado
        setIsAuthenticating(false);
        setShowEmailForm(false);
        
        // Admin tem acesso total a todos os NFTs
        setUserNFTs(mockNFTs);
        
        toast({
          title: '🔑 Acesso de Administrador!',
          description: `Bem-vindo Admin! Acesso total ao sistema concedido.`
        });
      }, 1500);
      return;
    }
    
    // Login normal para outros usuários
    setTimeout(() => {
      setCurrentStep(3);
      setIsAuthenticating(false);
      setShowEmailForm(false);
      
      // Simular que o usuário tem NFTs associados ao email
      setUserNFTs(mockNFTs.slice(0, 3));
      
      toast({
        title: 'Login realizado com sucesso!',
        description: `Bem-vindo ${email}! ${mockNFTs.slice(0, 3).length} NFTs encontrados.`
      });
    }, 1500);
  };

  // Verificar propriedade do NFT
  const verifyNFTOwnership = async () => {
    if (!selectedNFT) return;
    
    setIsAuthenticating(true);
    
    // Simular verificação
    setTimeout(() => {
      setCurrentStep(4);
      setIsAuthenticating(false);
      
      toast({
        title: 'NFT verificado!',
        description: 'Propriedade confirmada. Gerando credenciais...'
      });
      
      // Simular geração de credenciais
      setTimeout(() => {
        setCurrentStep(5);
        toast({
          title: 'Login realizado com sucesso!',
          description: `Bem-vindo! Acesso ${selectedNFT.accessLevel} concedido.`
        });
        
        // Redirecionar após login
        setTimeout(() => {
          localStorage.setItem('nft_authenticated', 'true');
          localStorage.setItem('access_level', selectedNFT.accessLevel);
          setLocation('/dashboard');
        }, 2000);
      }, 1500);
    }, 3000);
  };

  // Enviar por SMS
  const sendSMSCode = () => {
    toast({
      title: 'SMS enviado!',
      description: `Código ${authCode} enviado para seu celular.`
    });
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'vip': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'premium': return 'bg-gradient-to-r from-blue-500 to-purple-500';
      default: return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Login com NFT
          </h1>
          <p className="text-gray-300 text-lg">
            Autentique-se usando seus NFTs como chave de acesso digital
          </p>
        </div>

        {/* Indicador de Progresso */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {index < 4 && (
                  <div className={`h-1 w-12 mx-2 transition-all ${
                    currentStep > step ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-2xl bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">
              {currentStep === 1 && 'Conectar Carteira'}
              {currentStep === 2 && 'Selecionar NFT'}
              {currentStep === 3 && 'Código de Autenticação'}
              {currentStep === 4 && 'Verificando Propriedade'}
              {currentStep === 5 && 'Acesso Concedido'}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {currentStep === 1 && 'Escolha sua carteira para conectar'}
              {currentStep === 2 && 'Selecione o NFT para autenticação'}
              {currentStep === 3 && 'Confirme sua identidade'}
              {currentStep === 4 && 'Verificando propriedade do NFT...'}
              {currentStep === 5 && 'Login realizado com sucesso!'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Passo 1: Conectar Carteira */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Login Social */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4 text-center">Login Social</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Button
                      onClick={() => handleSocialLogin('google')}
                      variant="outline"
                      className="h-16 flex items-center gap-3 border-gray-600 hover:border-red-500 text-white hover:bg-red-500/10"
                    >
                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <span>Google</span>
                    </Button>
                    
                    <Button
                      onClick={() => handleSocialLogin('facebook')}
                      variant="outline"
                      className="h-16 flex items-center gap-3 border-gray-600 hover:border-blue-600 text-white hover:bg-blue-600/10"
                    >
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">f</span>
                      </div>
                      <span>Facebook</span>
                    </Button>
                    
                    <Button
                      onClick={() => handleEmailLogin()}
                      variant="outline"
                      className="h-16 flex items-center gap-3 border-gray-600 hover:border-green-500 text-white hover:bg-green-500/10"
                    >
                      <Smartphone className="h-6 w-6" />
                      <span>Email</span>
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-gray-800 px-4 text-gray-400">
                      Ou conecte sua carteira Web3
                    </span>
                  </div>
                </div>

                {/* Carteiras Web3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleWalletConnect('MetaMask')}
                    variant="outline"
                    className="h-16 flex items-center gap-3 border-gray-600 hover:border-orange-500 text-white hover:bg-orange-500/10"
                  >
                    <Wallet className="h-6 w-6" />
                    <span>MetaMask</span>
                  </Button>
                  
                  <Button
                    onClick={() => handleWalletConnect('WalletConnect')}
                    variant="outline"
                    className="h-16 flex items-center gap-3 border-gray-600 hover:border-purple-500 text-white hover:bg-purple-500/10"
                  >
                    <Wallet className="h-6 w-6" />
                    <span>WalletConnect</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Formulário de Email */}
            {showEmailForm && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Login com Email</h3>
                  <Button
                    onClick={() => setShowEmailForm(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
                
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Senha
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Digite sua senha"
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isAuthenticating || !email || !password}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isAuthenticating ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Fazendo login...
                      </div>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
                
                <div className="space-y-2">
                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-md p-3">
                    <p className="text-xs text-blue-300 font-medium mb-1">
                      💡 Credenciais de Teste:
                    </p>
                    <p className="text-xs text-gray-300">
                      <strong>Admin:</strong> admin / 123 (Acesso total)
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-400 text-center">
                    Não tem conta? 
                    <span className="text-blue-400 hover:text-blue-300 cursor-pointer ml-1">
                      Criar conta
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Passo 2: Selecionar NFT */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Alert className="bg-blue-900/30 border-blue-700">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-blue-200">
                    {userNFTs.length} NFTs encontrados em sua carteira. Selecione um para autenticação.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {userNFTs.map((nft) => (
                    <Card 
                      key={nft.id} 
                      className="cursor-pointer hover:shadow-xl transition-all bg-gray-700/50 border-gray-600 hover:border-purple-500"
                      onClick={() => handleNFTSelect(nft)}
                    >
                      <div className="relative">
                        <img 
                          src={nft.image} 
                          alt={nft.name}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <Badge className={`absolute top-2 right-2 ${getAccessLevelColor(nft.accessLevel)} text-white`}>
                          {nft.accessLevel.toUpperCase()}
                        </Badge>
                        {nft.verified && (
                          <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verificado
                          </Badge>
                        )}
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-white mb-1">{nft.name}</h3>
                        <p className="text-xs text-gray-400 mb-2">#{nft.tokenId}</p>
                        <p className="text-xs text-gray-500">{nft.contractAddress}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Passo 3: Código de Autenticação */}
            {currentStep === 3 && selectedNFT && (
              <div className="space-y-6">
                <div className="text-center">
                  <img 
                    src={selectedNFT.image} 
                    alt={selectedNFT.name}
                    className="w-32 h-32 mx-auto rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-semibold text-white">{selectedNFT.name}</h3>
                  <p className="text-gray-400">Token ID: #{selectedNFT.tokenId}</p>
                </div>

                <Alert className="bg-green-900/30 border-green-700">
                  <Key className="h-4 w-4" />
                  <AlertDescription className="text-green-200">
                    Código de autenticação gerado: <strong className="text-green-300">{authCode}</strong>
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={verifyNFTOwnership}
                    className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Fingerprint className="h-6 w-6 mr-2" />
                    Verificar Propriedade
                  </Button>
                  
                  <Button 
                    onClick={sendSMSCode}
                    variant="outline"
                    className="h-16 border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Smartphone className="h-6 w-6 mr-2" />
                    Enviar por SMS
                  </Button>
                </div>
              </div>
            )}

            {/* Passo 4: Verificando */}
            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Verificando Propriedade do NFT</h3>
                  <p className="text-gray-400">Confirmando autenticidade e propriedade...</p>
                </div>

                <Alert className="bg-yellow-900/30 border-yellow-700">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-yellow-200">
                    Processo de verificação em andamento. Aguarde alguns segundos.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Passo 5: Sucesso */}
            {currentStep === 5 && selectedNFT && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Login Realizado com Sucesso!</h3>
                  <p className="text-gray-400">Redirecionando para o dashboard...</p>
                </div>

                <Alert className="bg-green-900/30 border-green-700">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription className="text-green-200">
                    Acesso <strong className="text-green-300">{selectedNFT.accessLevel.toUpperCase()}</strong> concedido.
                    Credenciais geradas e armazenadas com segurança.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Lock className="h-4 w-4" />
                  <span>Sessão protegida por criptografia blockchain</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Primeiro login com NFT? <span className="text-blue-400 cursor-pointer hover:underline">Saiba mais sobre o processo</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NFTLogin;