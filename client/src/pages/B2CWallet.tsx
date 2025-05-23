import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, QrCode, Gift, ArrowLeft, Plus, Send, 
  RefreshCw, Eye, EyeOff, Star, Clock, Shield,
  CreditCard, Smartphone, Download, Share,
  TrendingUp, History, Settings, Bell, AlertTriangle
} from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

interface NFTGiftCard {
  id: string;
  title: string;
  merchant: string;
  category: string;
  balanceUsd: number;
  balanceEth: number;
  originalValue: number;
  status: 'active' | 'empty' | 'expired';
  isPrivacyEnabled: boolean;
  expiryDate: string;
  image: string;
  features: string[];
  lastUsed?: string;
  qrCode: string;
}

interface Transaction {
  id: string;
  type: 'received' | 'spent' | 'recharged';
  amount: number;
  merchant: string;
  date: string;
  nftId: string;
}

const B2CWallet = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { isConnected, walletAddress } = useWallet();
  const [selectedNFT, setSelectedNFT] = useState<NFTGiftCard | null>(null);
  const [showPrivateInfo, setShowPrivateInfo] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [currentTab, setCurrentTab] = useState('carteira');

  // Mock data para demonstração
  const [myNFTs] = useState<NFTGiftCard[]>([
    {
      id: '0x1a2b3c4d5e6f',
      title: 'Amazon Gift Card Premium',
      merchant: 'Amazon',
      category: 'E-commerce',
      balanceUsd: 45.50,
      balanceEth: 0.02275,
      originalValue: 50.00,
      status: 'active',
      isPrivacyEnabled: true,
      expiryDate: '2024-12-31',
      image: 'https://via.placeholder.com/300x200/FF9900/FFFFFF?text=Amazon',
      features: ['Recarregável', 'Privacidade Habilitada'],
      lastUsed: '2024-01-15',
      qrCode: 'QR_CODE_DATA_AMAZON'
    },
    {
      id: '0x2b3c4d5e6f7g',
      title: 'Netflix Streaming Pass',
      merchant: 'Netflix',
      category: 'Streaming',
      balanceUsd: 0.00,
      balanceEth: 0.00,
      originalValue: 15.99,
      status: 'empty',
      isPrivacyEnabled: false,
      expiryDate: '2024-06-30',
      image: 'https://via.placeholder.com/300x200/E50914/FFFFFF?text=Netflix',
      features: ['Auto-renovação'],
      lastUsed: '2024-01-10',
      qrCode: 'QR_CODE_DATA_NETFLIX'
    },
    {
      id: '0x3c4d5e6f7g8h',
      title: 'Starbucks Coffee Card',
      merchant: 'Starbucks',
      category: 'Alimentação',
      balanceUsd: 25.75,
      balanceEth: 0.012875,
      originalValue: 30.00,
      status: 'active',
      isPrivacyEnabled: true,
      expiryDate: '2024-08-15',
      image: 'https://via.placeholder.com/300x200/00704A/FFFFFF?text=Starbucks',
      features: ['Recarregável', 'Pontos de Fidelidade'],
      lastUsed: '2024-01-12',
      qrCode: 'QR_CODE_DATA_STARBUCKS'
    }
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: 'tx1',
      type: 'received',
      amount: 50.00,
      merchant: 'Amazon',
      date: '2024-01-01',
      nftId: '0x1a2b3c4d5e6f'
    },
    {
      id: 'tx2',
      type: 'spent',
      amount: -4.50,
      merchant: 'Amazon',
      date: '2024-01-15',
      nftId: '0x1a2b3c4d5e6f'
    },
    {
      id: 'tx3',
      type: 'received',
      amount: 15.99,
      merchant: 'Netflix',
      date: '2024-01-05',
      nftId: '0x2b3c4d5e6f7g'
    },
    {
      id: 'tx4',
      type: 'spent',
      amount: -15.99,
      merchant: 'Netflix',
      date: '2024-01-10',
      nftId: '0x2b3c4d5e6f7g'
    }
  ]);

  const totalBalance = myNFTs.reduce((sum, nft) => sum + nft.balanceUsd, 0);
  const activeNFTs = myNFTs.filter(nft => nft.status === 'active').length;

  const generateQRCode = (nft: NFTGiftCard) => {
    // Em produção, isso geraria um QR Code real
    toast({
      title: 'QR Code gerado!',
      description: `QR Code do ${nft.title} pronto para uso.`
    });
  };

  const rechargeNFT = (nft: NFTGiftCard) => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Insira um valor válido para recarga.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Recarga processada!',
      description: `$${rechargeAmount} adicionados ao ${nft.title}.`
    });
    setRechargeAmount('');
  };

  const shareNFT = (nft: NFTGiftCard) => {
    // Em produção, isso abriria opções de compartilhamento
    toast({
      title: 'Compartilhar NFT',
      description: 'Funcionalidade de compartilhamento será implementada.'
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Wallet className="h-6 w-6" />
              Conecte sua Carteira
            </CardTitle>
            <CardDescription>
              Você precisa conectar sua carteira para acessar seus NFT Gift Cards
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => setLocation('/login')} className="w-full">
              Conectar Carteira
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-6xl py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation('/dashboard')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Minha Carteira NFT
          </h1>
          <p className="text-lg text-muted-foreground">
            Gerencie seus NFT Gift Cards de forma segura e privada
          </p>
        </div>

        {/* Resumo da Carteira */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Total</p>
                  <p className="text-2xl font-bold">${totalBalance.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">NFTs Ativos</p>
                  <p className="text-2xl font-bold">{activeNFTs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total NFTs</p>
                  <p className="text-2xl font-bold">{myNFTs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="carteira" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6 h-12">
            <TabsTrigger value="carteira" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Carteira
            </TabsTrigger>
            <TabsTrigger value="qr-code" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Codes
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Tab Carteira */}
          <TabsContent value="carteira">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myNFTs.map((nft) => (
                <Card key={nft.id} className="shadow-xl hover:shadow-2xl transition-all cursor-pointer" onClick={() => setSelectedNFT(nft)}>
                  <div className="relative">
                    <img 
                      src={nft.image} 
                      alt={nft.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${
                        nft.status === 'active' ? 'bg-green-500' : 
                        nft.status === 'empty' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                    >
                      {nft.status === 'active' ? 'Ativo' : 
                       nft.status === 'empty' ? 'Esgotado' : 'Expirado'}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{nft.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{nft.merchant}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Saldo:</span>
                        <span className="font-semibold">${nft.balanceUsd.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Valor Original:</span>
                        <span className="text-sm">${nft.originalValue.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {nft.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab QR Codes */}
          <TabsContent value="qr-code">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myNFTs.filter(nft => nft.status === 'active').map((nft) => (
                <Card key={nft.id} className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{nft.title}</span>
                      <Badge>{nft.merchant}</Badge>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="w-48 h-48 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                    
                    <div className="text-center space-y-2">
                      <p className="font-semibold">Saldo: ${nft.balanceUsd.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">ID: {nft.id}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => generateQRCode(nft)}
                        className="flex-1"
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                      <Button 
                        onClick={() => shareNFT(nft)}
                        className="flex-1"
                        variant="outline"
                      >
                        <Share className="h-4 w-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Histórico */}
          <TabsContent value="historico">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Histórico de Transações</CardTitle>
                <CardDescription>
                  Todas as suas transações com NFT Gift Cards
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'received' ? 'bg-green-100 text-green-600' :
                          tx.type === 'spent' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {tx.type === 'received' ? <Plus className="h-5 w-5" /> :
                           tx.type === 'spent' ? <Send className="h-5 w-5" /> :
                           <RefreshCw className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium">{tx.merchant}</p>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">{tx.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Configurações */}
          <TabsContent value="configuracoes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Privacidade</CardTitle>
                  <CardDescription>
                    Configure suas preferências de privacidade
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      <span>Mostrar informações privadas</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPrivateInfo(!showPrivateInfo)}
                    >
                      {showPrivateInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      <span>Notificações</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Carteira Conectada</CardTitle>
                  <CardDescription>
                    Informações da sua carteira
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <Label>Endereço</Label>
                    <Input 
                      value={walletAddress || ''} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Configurar App Mobile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de detalhes do NFT */}
        {selectedNFT && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedNFT.title}</CardTitle>
                    <CardDescription>{selectedNFT.merchant}</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedNFT(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <img 
                  src={selectedNFT.image} 
                  alt={selectedNFT.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Saldo Atual</Label>
                    <p className="text-2xl font-bold">${selectedNFT.balanceUsd.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label>Valor Original</Label>
                    <p className="text-xl">${selectedNFT.originalValue.toFixed(2)}</p>
                  </div>
                </div>
                
                {selectedNFT.status === 'active' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="recharge">Valor para Recarga (USD)</Label>
                      <Input
                        id="recharge"
                        type="number"
                        placeholder="0.00"
                        value={rechargeAmount}
                        onChange={(e) => setRechargeAmount(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      onClick={() => rechargeNFT(selectedNFT)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Recarregar NFT
                    </Button>
                  </div>
                )}
                
                {selectedNFT.status === 'empty' && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Este NFT está esgotado. Recarregue para voltar a usar.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default B2CWallet;