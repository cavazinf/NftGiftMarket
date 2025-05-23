import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { 
  CheckCircle, Lock, ShieldCheck, Eye, EyeOff, Key, FileText, 
  ArrowRight, FileCheck, Clock, AlertCircle, RefreshCw, Download,
  BookOpen, FileCode, MessageSquare, ListChecks, CreditCard, Wallet, Gift
} from 'lucide-react';

// Componente principal para ZK Privacy
const ZKPrivacy = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { isConnected, walletAddress } = useWallet();
  const [currentTab, setCurrentTab] = useState('overview');
  const [giftCardId, setGiftCardId] = useState('');
  const [amount, setAmount] = useState('');
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [isVerifyingProof, setIsVerifyingProof] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);
  const [selectedProof, setSelectedProof] = useState<any>(null);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  
  // Lista de provas geradas recentemente (simulação)
  const recentProofs = [
    { 
      id: "zk-proof-8753", 
      type: "balance",
      giftCardId: 1234,
      giftCardName: "Amazon Premium",
      generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: "verified",
      usedAt: null,
      hash: "0x8f71d9...",
    },
    { 
      id: "zk-proof-6542", 
      type: "ownership",
      giftCardId: 1452,
      giftCardName: "Netflix",
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "verified",
      usedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      hash: "0x23ea7b...",
    },
    { 
      id: "zk-proof-4235", 
      type: "balance",
      giftCardId: 2561,
      giftCardName: "Steam Gaming",
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "expired",
      usedAt: null,
      hash: "0xac4578...",
    }
  ];
  
  // Lista de gift cards (simulação)
  const myGiftCards = [
    { 
      id: 1234, 
      title: "Amazon Premium",
      description: "Gift card para compras na Amazon",
      balance: {
        eth: 0.025,
        usd: 50
      }
    },
    { 
      id: 1452, 
      title: "Netflix",
      description: "Assinatura Netflix de 3 meses",
      balance: {
        eth: 0.02,
        usd: 40
      }
    },
    { 
      id: 2561, 
      title: "Steam Gaming",
      description: "Gift card para jogos na Steam",
      balance: {
        eth: 0.035,
        usd: 70
      }
    }
  ];
  
  // Função para gerar uma prova ZK
  const handleGenerateProof = () => {
    if (!giftCardId) {
      toast({
        title: "ID não especificado",
        description: "Por favor, selecione um gift card para gerar a prova.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGeneratingProof(true);
    
    // Simulação do tempo de geração da prova
    setTimeout(() => {
      setIsGeneratingProof(false);
      setProofGenerated(true);
      
      toast({
        title: "Prova ZK gerada com sucesso",
        description: "A prova Zero-Knowledge foi criada e está pronta para uso.",
      });
    }, 3000);
  };
  
  // Função para verificar uma prova ZK
  const handleVerifyProof = (proof: any) => {
    setSelectedProof(proof);
    setIsVerifyDialogOpen(true);
  };
  
  // Função para confirmar verificação da prova
  const confirmVerifyProof = () => {
    setIsVerifyingProof(true);
    
    // Simulação do tempo de verificação
    setTimeout(() => {
      setIsVerifyingProof(false);
      setIsVerifyDialogOpen(false);
      
      toast({
        title: "Prova verificada com sucesso",
        description: "A verificação da prova ZK foi concluída com sucesso."
      });
    }, 2000);
  };
  
  // Função para formatar timestamp
  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="bg-muted/30 min-h-screen pb-8">
      <div className="bg-background">
        <div className="container py-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Privacidade ZK</h1>
              <p className="text-sm text-muted-foreground">Zero-Knowledge Proofs para Gift Cards</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setLocation('/marketplace')}>
              Marketplace
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLocation('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLocation('/defi')}>
              DeFi Hub
            </Button>
            <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {isConnected && walletAddress 
                  ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` 
                  : 'Não conectado'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Barra lateral */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant={currentTab === 'overview' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('overview')}
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    Visão Geral
                  </Button>
                  <Button 
                    variant={currentTab === 'generate' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('generate')}
                  >
                    <Key className="mr-2 h-5 w-5" />
                    Gerar Prova
                  </Button>
                  <Button 
                    variant={currentTab === 'proofs' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('proofs')}
                  >
                    <FileCheck className="mr-2 h-5 w-5" />
                    Minhas Provas
                  </Button>
                  <Button 
                    variant={currentTab === 'learn' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('learn')}
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Aprenda
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Info de ZK */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">ZK Status</CardTitle>
                <CardDescription>Provas ZK disponíveis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-green-500/10">
                      <FileText className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-sm">Provas Ativas</span>
                  </div>
                  <span className="font-medium">2</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-amber-500/10">
                      <Clock className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="text-sm">Provas Expiradas</span>
                  </div>
                  <span className="font-medium">1</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-blue-500/10">
                      <Gift className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-sm">Gift Cards</span>
                  </div>
                  <span className="font-medium">3</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center font-medium">
                  <span>Status do Sistema</span>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>Operacional</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Ações rápidas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentTab('generate')}>
                  <Key className="mr-2 h-4 w-4" />
                  Nova Prova
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setCurrentTab('proofs')}>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Verificar Provas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Histório
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Conteúdo principal */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Visão Geral */}
            {currentTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Zero-Knowledge Proofs</h2>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Atualizar
                  </Button>
                </div>
                
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertTitle>Privacidade Garantida</AlertTitle>
                  <AlertDescription>
                    Todas as provas Zero-Knowledge são criptografadas e não revelam nenhuma informação sobre seus gift cards ou saldos.
                  </AlertDescription>
                </Alert>
                
                {/* Cards de métricas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Verificações Mensais</p>
                          <div className="text-2xl font-bold">3,845</div>
                          <p className="text-xs flex items-center text-muted-foreground">
                            Sem expor dados sensíveis
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
                          <FileCheck className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Taxa de Verificação</p>
                          <div className="text-2xl font-bold">99.8%</div>
                          <p className="text-xs flex items-center text-muted-foreground">
                            Provas verificadas com sucesso
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-green-500/10 flex items-center justify-center rounded-full">
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Tempo Médio</p>
                          <div className="text-2xl font-bold">2.4s</div>
                          <p className="text-xs flex items-center text-muted-foreground">
                            Para verificação de provas
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-blue-500/10 flex items-center justify-center rounded-full">
                          <Clock className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Como funciona */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Como Funcionam as Provas ZK</CardTitle>
                    <CardDescription>
                      Zero-Knowledge Proofs permitem verificar informações sem revelá-las
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
                          <Key className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium">1. Geração da Prova</h3>
                        <p className="text-sm text-muted-foreground">
                          Você gera uma prova criptográfica que verifica informações do seu gift card sem revelar os dados.
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
                          <FileCheck className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium">2. Verificação</h3>
                        <p className="text-sm text-muted-foreground">
                          A prova é verificada matematicamente sem revelar nenhum dado sensível do gift card.
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center space-y-2">
                        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium">3. Utilização</h3>
                        <p className="text-sm text-muted-foreground">
                          Você pode usar seu gift card com privacidade total, sem revelar saldo ou histórico.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Provas recentes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Provas Recentes</CardTitle>
                    <CardDescription>
                      Últimas provas ZK geradas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProofs.map((proof) => (
                        <div key={proof.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{proof.giftCardName}</h3>
                                <Badge variant={proof.status === 'verified' ? 'default' : 'destructive'}>
                                  {proof.status === 'verified' ? 'Verificada' : 'Expirada'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                ID: {proof.id} • Gerada em: {formatDate(proof.generatedAt)}
                              </p>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleVerifyProof(proof)}>
                              Verificar
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center">
                              <Key className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{proof.type === 'balance' ? 'Prova de Saldo' : 'Prova de Propriedade'}</span>
                            </div>
                            <div className="flex items-center">
                              <Gift className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>Gift Card #{proof.giftCardId}</span>
                            </div>
                            {proof.usedAt && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>Usada em: {formatDate(proof.usedAt)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Gerar Prova */}
            {currentTab === 'generate' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Gerar Nova Prova ZK</h2>
                    <p className="text-muted-foreground">
                      Crie uma prova Zero-Knowledge para seu gift card
                    </p>
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Gerador de Provas ZK</CardTitle>
                    <CardDescription>
                      Selecione um gift card e o tipo de prova que deseja gerar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="gift-card">Gift Card</Label>
                      <Select value={giftCardId} onValueChange={setGiftCardId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um gift card" />
                        </SelectTrigger>
                        <SelectContent>
                          {myGiftCards.map(card => (
                            <SelectItem key={card.id} value={card.id.toString()}>
                              {card.title} - ${card.balance.usd}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="proof-type">Tipo de Prova</Label>
                      <Select defaultValue="balance">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de prova" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="balance">Prova de Saldo</SelectItem>
                          <SelectItem value="ownership">Prova de Propriedade</SelectItem>
                          <SelectItem value="purchase">Prova de Compra</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        A prova de saldo permite verificar que você possui um saldo mínimo sem revelar o valor exato.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Valor a Verificar (opcional)</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="amount" 
                          placeholder="0.00" 
                          className="flex-1"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                        <Select defaultValue="usd">
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Moeda" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="eth">ETH</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Para provas de saldo, você pode definir um valor específico a ser verificado.
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                      <div className="flex items-center">
                        <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Informações de Privacidade</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        As provas Zero-Knowledge garantem total privacidade. Nenhuma informação sensível como saldo, 
                        histórico de transações ou detalhes do gift card será revelada.
                      </p>
                      <div className="flex flex-col space-y-1 text-sm">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>Verificação matemática sem revelar dados</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>Provas válidas por 7 dias após a geração</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>Conforme com regulamentações de privacidade</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button 
                      className="w-full" 
                      onClick={handleGenerateProof}
                      disabled={isGeneratingProof}
                    >
                      {isGeneratingProof ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Gerando Prova...
                        </>
                      ) : (
                        <>
                          <Key className="mr-2 h-4 w-4" />
                          Gerar Prova ZK
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
                
                {proofGenerated && (
                  <Card className="border-green-200 dark:border-green-800">
                    <CardHeader className="bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <CardTitle className="text-lg text-green-600 dark:text-green-400">Prova Gerada com Sucesso</CardTitle>
                      </div>
                      <CardDescription>
                        Sua prova Zero-Knowledge foi criada e está pronta para uso
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="rounded-lg bg-muted p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">ID da Prova</p>
                            <p className="font-medium">zk-proof-9482</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <p className="font-medium text-green-600 dark:text-green-400">Verificada</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Gift Card</p>
                            <p className="font-medium">
                              {myGiftCards.find(card => card.id.toString() === giftCardId)?.title || "Não selecionado"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tipo</p>
                            <p className="font-medium">Prova de Saldo</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Gerada em</p>
                            <p className="font-medium">{new Date().toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Válida até</p>
                            <p className="font-medium">
                              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Alert className="bg-primary/10 text-primary">
                        <Key className="h-4 w-4" />
                        <AlertTitle>Prova ZK Criptografada</AlertTitle>
                        <AlertDescription className="font-mono text-xs break-all">
                          circuitHash:0x2a42b...7f31,publicSignals:[0x8b35c...e821,{amount ? amount : "50.00"},0x6e42...f12b],proof:[0x2c43...a18b,0x76f1...d23e]
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setCurrentTab('proofs')}>
                          Ver Todas as Provas
                        </Button>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Exportar Prova
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            
            {/* Minhas Provas */}
            {currentTab === 'proofs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Minhas Provas ZK</h2>
                    <p className="text-muted-foreground">
                      Gerencie suas provas Zero-Knowledge
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCurrentTab('generate')}>
                    <Key className="mr-2 h-4 w-4" />
                    Nova Prova
                  </Button>
                </div>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">Histórico de Provas</CardTitle>
                        <CardDescription>
                          Todas as provas Zero-Knowledge geradas
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Atualizar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProofs.map((proof) => (
                        <div 
                          key={proof.id} 
                          className={`border rounded-lg p-4 ${
                            proof.status === 'expired' ? 'border-red-200 dark:border-red-900' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{proof.giftCardName}</h3>
                                <Badge variant={proof.status === 'verified' ? 'default' : 'destructive'}>
                                  {proof.status === 'verified' ? 'Verificada' : 'Expirada'}
                                </Badge>
                                {proof.type === 'balance' ? (
                                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                    Prova de Saldo
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                    Prova de Propriedade
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                ID: {proof.id} • Gerada em: {formatDate(proof.generatedAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleVerifyProof(proof)}>
                                Verificar
                              </Button>
                              {!proof.usedAt && proof.status === 'verified' && (
                                <Button variant="outline" size="sm" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 hover:text-green-700 border-green-200 dark:border-green-800">
                                  Usar Prova
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <div className="flex items-center">
                              <Gift className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>Gift Card #{proof.giftCardId}</span>
                            </div>
                            <div className="flex items-center">
                              <FileCode className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>Hash: {proof.hash}</span>
                            </div>
                            {proof.usedAt && (
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>Usada em: {formatDate(proof.usedAt)}</span>
                              </div>
                            )}
                            {proof.status === 'expired' && (
                              <div className="flex items-center text-red-500">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                <span>Expirada em: {formatDate(new Date(proof.generatedAt.getTime() + 7 * 24 * 60 * 60 * 1000))}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Estatísticas de Uso</CardTitle>
                      <CardDescription>
                        Resumo do uso de provas Zero-Knowledge
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Provas Geradas (Total)</span>
                            <span className="font-medium">12</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Provas Utilizadas</span>
                            <span className="font-medium">8</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '66.7%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Provas Expiradas</span>
                            <span className="font-medium">3</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '25%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Provas Ativas</span>
                            <span className="font-medium">1</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '8.3%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Gift Cards Protegidos</CardTitle>
                      <CardDescription>
                        Gift cards com provas de privacidade
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {myGiftCards.map(card => (
                          <div key={card.id} className="border rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <div className="font-medium">{card.title}</div>
                              <div className="text-sm text-muted-foreground">${card.balance.usd} • {card.balance.eth} ETH</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                Protegido
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <EyeOff className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Aprenda sobre ZK */}
            {currentTab === 'learn' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Aprenda sobre Zero-Knowledge</h2>
                    <p className="text-muted-foreground">
                      Entenda como funcionam as provas ZK e seus benefícios
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">O que são Provas ZK?</CardTitle>
                      <CardDescription>
                        Uma introdução às provas Zero-Knowledge
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        Zero-Knowledge Proofs (ZKPs) são métodos criptográficos que permitem a uma parte provar a outra que uma afirmação é verdadeira, 
                        sem revelar nenhuma informação além da veracidade da afirmação.
                      </p>
                      <p>
                        Em nosso sistema, isso significa que você pode provar que possui um saldo suficiente em um gift card, ou que é o proprietário 
                        legítimo de um NFT, sem revelar o valor exato do saldo, seu histórico de transações ou outras informações sensíveis.
                      </p>
                      <Alert className="bg-muted">
                        <BookOpen className="h-4 w-4" />
                        <AlertTitle>Exemplo Simples</AlertTitle>
                        <AlertDescription>
                          Imagine que você queira provar a alguém que conhece a senha de uma conta, sem revelar a senha. Uma prova ZK permitiria 
                          que você demonstrasse esse conhecimento sem nunca mostrar a senha real.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Principais Benefícios</CardTitle>
                      <CardDescription>
                        Vantagens do uso de provas ZK em nossa plataforma
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Privacidade Total</h3>
                            <p className="text-sm text-muted-foreground">
                              Seu saldo, histórico de transações e dados pessoais permanecem completamente privados.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                            <Lock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Segurança Aprimorada</h3>
                            <p className="text-sm text-muted-foreground">
                              Verificações criptográficas impossíveis de falsificar garantem que apenas o proprietário legítimo possa usar o gift card.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Conformidade</h3>
                            <p className="text-sm text-muted-foreground">
                              As provas ZK atendem e superam os requisitos de proteção de dados exigidos por LGPD, GDPR e outras regulamentações.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="bg-primary/10 p-1.5 rounded-full mt-0.5">
                            <ArrowRight className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Interoperabilidade</h3>
                            <p className="text-sm text-muted-foreground">
                              As provas podem ser verificadas em diferentes blockchains e sistemas, mantendo a privacidade em qualquer lugar.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tipos de Provas ZK em Nossa Plataforma</CardTitle>
                    <CardDescription>
                      Diferentes tipos de provas para diferentes necessidades
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-medium">Prova de Saldo</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Permite provar que você possui um saldo mínimo específico em um gift card, sem revelar o valor exato do saldo.
                        </p>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm font-medium">Exemplo de uso:</p>
                          <p className="text-xs text-muted-foreground">
                            Provar que seu gift card tem pelo menos $50 para uma compra, sem revelar que o saldo real é de $200.
                          </p>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Key className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-medium">Prova de Propriedade</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Permite provar que você é o proprietário legítimo de um gift card NFT, sem revelar sua identidade ou chave privada.
                        </p>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm font-medium">Exemplo de uso:</p>
                          <p className="text-xs text-muted-foreground">
                            Transferir um gift card para outra pessoa sem revelar seu endereço de carteira ou histórico de transações.
                          </p>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <ListChecks className="h-5 w-5 text-primary" />
                          </div>
                          <h3 className="font-medium">Prova de Histórico</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Permite provar que um gift card tem um histórico legítimo de transações, sem revelar os detalhes específicos das transações.
                        </p>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-sm font-medium">Exemplo de uso:</p>
                          <p className="text-xs text-muted-foreground">
                            Comprovar que um gift card foi adquirido legitimamente, sem revelar quando, onde ou como foi comprado.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Implementação Técnica</CardTitle>
                    <CardDescription>
                      Como implementamos as provas ZK em nossa plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg p-4 border">
                        <h3 className="font-medium mb-2">Contratos Inteligentes</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Nossos contratos inteligentes utilizam o framework de ZK SNARKs para verificação eficiente de provas:
                        </p>
                        <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-auto">
{`// Verificação de prova ZK em nosso contrato LeanVoucherZK
function redeem(
    uint256 tokenId,
    uint256[2] calldata a,
    uint256[2][2] calldata b,
    uint256[2] calldata c,
    uint256[] calldata pubSignals
) external {
    require(ownerOf(tokenId) == msg.sender, "not owner");
    require(!used[tokenId], "used");
    require(verifyProof(a, b, c, pubSignals), "zk fail");
    uint256 amount = pubSignals[1];
    require(amount <= balance[tokenId], "insuf");
    balance[tokenId] -= amount;
    if (balance[tokenId] == 0) used[tokenId] = true;
}`}
                        </pre>
                      </div>
                      
                      <div className="rounded-lg p-4 border">
                        <h3 className="font-medium mb-2">Fluxo de Verificação</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          O processo completo de geração e verificação de provas:
                        </p>
                        <ol className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <div className="bg-primary/10 w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">1</div>
                            <div>
                              <span className="font-medium">Geração de prova no cliente</span>
                              <p className="text-muted-foreground">O usuário gera localmente uma prova ZK usando dados privados do gift card.</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="bg-primary/10 w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">2</div>
                            <div>
                              <span className="font-medium">Submissão da prova</span>
                              <p className="text-muted-foreground">A prova é enviada junto com os sinais públicos necessários para a verificação.</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="bg-primary/10 w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">3</div>
                            <div>
                              <span className="font-medium">Verificação on-chain</span>
                              <p className="text-muted-foreground">O contrato inteligente verifica a validade da prova sem acesso aos dados privados.</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="bg-primary/10 w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5">4</div>
                            <div>
                              <span className="font-medium">Execução da transação</span>
                              <p className="text-muted-foreground">Se a prova for válida, a transação é executada (resgate, transferência, etc).</p>
                            </div>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Dialog de verificação de prova */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verificar Prova ZK</DialogTitle>
            <DialogDescription>
              {selectedProof 
                ? `Verificar a prova ZK para o gift card ${selectedProof.giftCardName}`
                : 'Verificar a validade da prova Zero-Knowledge'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProof && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg bg-muted p-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">ID da Prova</p>
                  <p className="font-medium">{selectedProof.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tipo</p>
                  <p className="font-medium">
                    {selectedProof.type === 'balance' ? 'Prova de Saldo' : 'Prova de Propriedade'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gift Card</p>
                  <p className="font-medium">#{selectedProof.giftCardId} - {selectedProof.giftCardName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className={`font-medium ${selectedProof.status === 'verified' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'}`}>
                    {selectedProof.status === 'verified' ? 'Verificada' : 'Expirada'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gerada em</p>
                  <p className="font-medium">{formatDate(selectedProof.generatedAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hash</p>
                  <p className="font-medium">{selectedProof.hash}</p>
                </div>
              </div>
              
              {selectedProof.status === 'verified' && !selectedProof.usedAt ? (
                <div className="border rounded-lg p-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-medium text-green-600 dark:text-green-400">Prova Válida</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Esta prova é válida e pode ser usada para verificação privada do gift card.
                  </p>
                </div>
              ) : selectedProof.usedAt ? (
                <div className="border rounded-lg p-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-medium text-blue-600 dark:text-blue-400">Prova Já Utilizada</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Esta prova já foi utilizada em {formatDate(selectedProof.usedAt)}.
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <h3 className="font-medium text-red-600 dark:text-red-400">Prova Expirada</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Esta prova expirou e não pode mais ser utilizada. Por favor, gere uma nova prova.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmVerifyProof} disabled={isVerifyingProof || selectedProof?.status !== 'verified'}>
              {isVerifyingProof ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <FileCheck className="mr-2 h-4 w-4" />
                  Verificar Prova
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ZKPrivacy;