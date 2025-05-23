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
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, ArrowLeft, DollarSign, RefreshCw, 
  TrendingUp, Shield, AlertTriangle, CheckCircle,
  Banknote, PiggyBank, Receipt, Calculator,
  ArrowUpRight, ArrowDownLeft, Building2, Zap
} from 'lucide-react';

interface PaymentTransaction {
  id: string;
  nftId: string;
  merchantName: string;
  amount: number;
  changeAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  type: 'purchase' | 'refund' | 'recharge';
}

interface NFTBalance {
  id: string;
  title: string;
  currentBalance: number;
  originalBalance: number;
  merchant: string;
  status: 'active' | 'empty' | 'expired';
}

const FintechDApp = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [processingTransaction, setProcessingTransaction] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<string>('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [changeHandling, setChangeHandling] = useState<'keep' | 'new_nft' | 'refund'>('keep');

  // Mock data para demonstração
  const [transactions] = useState<PaymentTransaction[]>([
    {
      id: 'tx001',
      nftId: '0x1a2b3c4d5e6f',
      merchantName: 'Amazon Store',
      amount: 25.99,
      changeAmount: 24.01,
      status: 'completed',
      timestamp: '2024-01-15T10:30:00Z',
      type: 'purchase'
    },
    {
      id: 'tx002',
      nftId: '0x2b3c4d5e6f7g',
      merchantName: 'Coffee Shop',
      amount: 4.50,
      changeAmount: 0,
      status: 'completed',
      timestamp: '2024-01-15T14:20:00Z',
      type: 'purchase'
    },
    {
      id: 'tx003',
      nftId: '0x1a2b3c4d5e6f',
      merchantName: 'Amazon Store',
      amount: 50.00,
      changeAmount: 0,
      status: 'processing',
      timestamp: '2024-01-15T16:45:00Z',
      type: 'recharge'
    }
  ]);

  const [nftBalances] = useState<NFTBalance[]>([
    {
      id: '0x1a2b3c4d5e6f',
      title: 'Amazon Gift Card Premium',
      currentBalance: 74.01,
      originalBalance: 50.00,
      merchant: 'Amazon',
      status: 'active'
    },
    {
      id: '0x2b3c4d5e6f7g',
      title: 'Coffee Rewards Card',
      currentBalance: 15.50,
      originalBalance: 20.00,
      merchant: 'Coffee Shop',
      status: 'active'
    },
    {
      id: '0x3c4d5e6f7g8h',
      title: 'Netflix Premium',
      currentBalance: 0.00,
      originalBalance: 15.99,
      merchant: 'Netflix',
      status: 'empty'
    }
  ]);

  const totalValue = nftBalances.reduce((sum, nft) => sum + nft.currentBalance, 0);
  const activeNFTs = nftBalances.filter(nft => nft.status === 'active').length;
  const todayTransactions = transactions.filter(tx => 
    new Date(tx.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const processPayment = async () => {
    if (!selectedNFT || !transactionAmount) {
      toast({
        title: 'Dados incompletos',
        description: 'Selecione um NFT e insira o valor da transação.',
        variant: 'destructive'
      });
      return;
    }

    const amount = parseFloat(transactionAmount);
    const nft = nftBalances.find(n => n.id === selectedNFT);
    
    if (!nft) return;

    if (amount > nft.currentBalance) {
      toast({
        title: 'Saldo insuficiente',
        description: `Saldo disponível: $${nft.currentBalance.toFixed(2)}`,
        variant: 'destructive'
      });
      return;
    }

    setProcessingTransaction(true);

    // Simular processamento
    setTimeout(() => {
      const change = nft.currentBalance - amount;
      
      toast({
        title: 'Pagamento processado!',
        description: `Transação de $${amount.toFixed(2)} concluída com sucesso.`,
      });

      if (change > 0) {
        if (changeHandling === 'new_nft') {
          toast({
            title: 'Novo NFT de troco criado',
            description: `NFT de troco no valor de $${change.toFixed(2)} foi gerado.`,
          });
        } else if (changeHandling === 'refund') {
          toast({
            title: 'Troco devolvido',
            description: `$${change.toFixed(2)} foi devolvido para sua conta.`,
          });
        } else {
          toast({
            title: 'Troco mantido no NFT',
            description: `$${change.toFixed(2)} permanece no NFT original.`,
          });
        }
      } else {
        toast({
          title: 'NFT esgotado',
          description: 'O NFT foi totalmente utilizado e agora está inoperável.',
          variant: 'destructive'
        });
      }

      setProcessingTransaction(false);
      setTransactionAmount('');
      setSelectedNFT('');
    }, 3000);
  };

  const rechargeNFT = (nftId: string, amount: number) => {
    toast({
      title: 'Recarga processada',
      description: `$${amount.toFixed(2)} adicionados ao NFT.`,
    });
  };

  const createChangeNFT = (originalNftId: string, changeAmount: number) => {
    toast({
      title: 'NFT de troco criado',
      description: `Novo NFT gerado com valor de $${changeAmount.toFixed(2)}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-7xl py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation('/dashboard')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Fintech DApp
          </h1>
          <p className="text-lg text-muted-foreground">
            Processamento de pagamentos e gestão inteligente de saldo para NFT Gift Cards
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Valor Total</p>
                  <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">NFTs Ativos</p>
                  <p className="text-3xl font-bold">{activeNFTs}</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Transações Hoje</p>
                  <p className="text-3xl font-bold">{todayTransactions}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Taxa de Sucesso</p>
                  <p className="text-3xl font-bold">98.5%</p>
                </div>
                <Shield className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="dashboard" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6 h-12">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="processar" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Processar
            </TabsTrigger>
            <TabsTrigger value="balances" className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Saldos
            </TabsTrigger>
            <TabsTrigger value="transacoes" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Transações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Visão Geral de Transações</CardTitle>
                  <CardDescription>Últimas atividades do sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.status === 'completed' ? 'bg-green-100 text-green-600' :
                            tx.status === 'processing' ? 'bg-yellow-100 text-yellow-600' :
                            tx.status === 'failed' ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {tx.type === 'purchase' ? <ArrowUpRight className="h-5 w-5" /> :
                             tx.type === 'refund' ? <ArrowDownLeft className="h-5 w-5" /> :
                             <RefreshCw className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-medium">{tx.merchantName}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(tx.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${tx.amount.toFixed(2)}</p>
                          <Badge variant={
                            tx.status === 'completed' ? 'default' :
                            tx.status === 'processing' ? 'secondary' :
                            'destructive'
                          }>
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Status do Sistema</CardTitle>
                  <CardDescription>Monitoramento em tempo real</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Performance do Sistema</span>
                      <span>98.5%</span>
                    </div>
                    <Progress value={98.5} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Capacidade de Processamento</span>
                      <span>76%</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Segurança</span>
                      <span>100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>

                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Sistema operando normalmente. Todas as transações estão sendo processadas com segurança.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Processar Pagamentos */}
          <TabsContent value="processar">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Processar Pagamento</CardTitle>
                <CardDescription>
                  Execute transações e gerencie trocos automaticamente
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nft-select">Selecionar NFT</Label>
                      <select 
                        id="nft-select"
                        value={selectedNFT}
                        onChange={(e) => setSelectedNFT(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                      >
                        <option value="">Escolha um NFT...</option>
                        {nftBalances.filter(nft => nft.status === 'active').map((nft) => (
                          <option key={nft.id} value={nft.id}>
                            {nft.title} - ${nft.currentBalance.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="amount">Valor da Transação (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(e.target.value)}
                        step="0.01"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <Label>Gestão do Troco</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="keep"
                            checked={changeHandling === 'keep'}
                            onChange={(e) => setChangeHandling(e.target.value as any)}
                          />
                          <span>Manter no NFT original</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="new_nft"
                            checked={changeHandling === 'new_nft'}
                            onChange={(e) => setChangeHandling(e.target.value as any)}
                          />
                          <span>Criar novo NFT de troco</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            value="refund"
                            checked={changeHandling === 'refund'}
                            onChange={(e) => setChangeHandling(e.target.value as any)}
                          />
                          <span>Devolver para conta</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedNFT && transactionAmount && (
                      <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30">
                        <h4 className="font-semibold mb-3">Preview da Transação</h4>
                        {(() => {
                          const nft = nftBalances.find(n => n.id === selectedNFT);
                          const amount = parseFloat(transactionAmount);
                          if (!nft) return null;
                          
                          const change = nft.currentBalance - amount;
                          
                          return (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>NFT:</span>
                                <span>{nft.title}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Saldo atual:</span>
                                <span>${nft.currentBalance.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Valor da compra:</span>
                                <span>${amount.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span>Troco:</span>
                                <span>${change.toFixed(2)}</span>
                              </div>
                              {change === 0 && (
                                <Alert className="bg-yellow-50 border-yellow-200 mt-3">
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>
                                    NFT será totalmente utilizado e ficará inoperável.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <Button
                      onClick={processPayment}
                      disabled={processingTransaction || !selectedNFT || !transactionAmount}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12"
                    >
                      {processingTransaction ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Processando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Processar Pagamento
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saldos */}
          <TabsContent value="balances">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nftBalances.map((nft) => (
                <Card key={nft.id} className="shadow-xl">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{nft.title}</CardTitle>
                        <CardDescription>{nft.merchant}</CardDescription>
                      </div>
                      <Badge variant={
                        nft.status === 'active' ? 'default' :
                        nft.status === 'empty' ? 'destructive' : 'secondary'
                      }>
                        {nft.status === 'active' ? 'Ativo' :
                         nft.status === 'empty' ? 'Esgotado' : 'Expirado'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Saldo Atual</span>
                        <span className="text-2xl font-bold">${nft.currentBalance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Valor Original</span>
                        <span className="text-sm">${nft.originalBalance.toFixed(2)}</span>
                      </div>
                      <Progress 
                        value={(nft.currentBalance / nft.originalBalance) * 100} 
                        className="mt-2 h-2"
                      />
                    </div>
                    
                    {nft.status === 'active' && (
                      <Button
                        onClick={() => rechargeNFT(nft.id, 25.00)}
                        variant="outline"
                        className="w-full"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Recarregar (+$25)
                      </Button>
                    )}
                    
                    {nft.status === 'empty' && (
                      <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          NFT esgotado. Recarregue para voltar a funcionar.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transações */}
          <TabsContent value="transacoes">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Histórico Completo de Transações</CardTitle>
                <CardDescription>
                  Todas as transações processadas pelo sistema
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-600' :
                          tx.status === 'processing' ? 'bg-yellow-100 text-yellow-600' :
                          tx.status === 'failed' ? 'bg-red-100 text-red-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {tx.type === 'purchase' ? <ArrowUpRight className="h-6 w-6" /> :
                           tx.type === 'refund' ? <ArrowDownLeft className="h-6 w-6" /> :
                           <RefreshCw className="h-6 w-6" />}
                        </div>
                        <div>
                          <p className="font-semibold">{tx.merchantName}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {tx.id} | NFT: {tx.nftId.slice(0, 10)}...
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${tx.amount.toFixed(2)}</p>
                        {tx.changeAmount > 0 && (
                          <p className="text-sm text-muted-foreground">
                            Troco: ${tx.changeAmount.toFixed(2)}
                          </p>
                        )}
                        <Badge variant={
                          tx.status === 'completed' ? 'default' :
                          tx.status === 'processing' ? 'secondary' :
                          'destructive'
                        }>
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30">
            <Building2 className="h-4 w-4" />
            <AlertDescription>
              <strong>Sistema Fintech Inteligente:</strong> Nossa plataforma processa automaticamente pagamentos, gerencia trocos e mantém NFTs operacionais através de recargas inteligentes. Quando um NFT é totalmente utilizado, ele se torna colecionável até a próxima recarga.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default FintechDApp;