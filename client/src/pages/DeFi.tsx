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
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  DollarSign, PlusCircle, MinusCircle, RefreshCw, ArrowUpRight, 
  ArrowDownRight, BarChart3, PieChart as PieChartIcon, Share2, 
  Layers, Wallet, CreditCard, Clock, ShieldCheck, ArrowRightLeft, 
  Lock, LockOpen, Gift, Timer, Database, Coins, LineChart as LineChartIcon
} from 'lucide-react';

// Dados de exemplo para os gráficos
const yieldData = [
  { name: 'Jan', apy: 5.2 },
  { name: 'Fev', apy: 5.4 },
  { name: 'Mar', apy: 5.5 },
  { name: 'Abr', apy: 5.7 },
  { name: 'Mai', apy: 5.8 },
  { name: 'Jun', apy: 6.0 },
  { name: 'Jul', apy: 6.1 },
  { name: 'Ago', apy: 6.3 },
  { name: 'Set', apy: 6.4 },
  { name: 'Out', apy: 6.5 },
  { name: 'Nov', apy: 6.6 },
  { name: 'Dez', apy: 6.8 },
];

const liquidityPoolData = [
  { name: 'USDC', value: 45, fill: '#2775CA' },
  { name: 'DAI', value: 25, fill: '#F5AC37' },
  { name: 'USDT', value: 30, fill: '#26A17B' },
];

const stakingData = [
  { name: 'VCHR', value: 60, fill: '#8884d8' },
  { name: 'ETH-VCHR LP', value: 30, fill: '#82ca9d' },
  { name: 'USDC-VCHR LP', value: 10, fill: '#ffc658' },
];

const vaultData = [
  { name: 'Jan', value: 1000 },
  { name: 'Fev', value: 1300 },
  { name: 'Mar', value: 1800 },
  { name: 'Abr', value: 2400 },
  { name: 'Mai', value: 3200 },
  { name: 'Jun', value: 4100 },
  { name: 'Jul', value: 5000 },
  { name: 'Ago', value: 6200 },
  { name: 'Set', value: 7500 },
  { name: 'Out', value: 9000 },
  { name: 'Nov', value: 10800 },
  { name: 'Dez', value: 12500 },
];

// Componente principal de DeFi
const DeFi = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { isConnected, walletAddress } = useWallet();
  const [currentTab, setCurrentTab] = useState('overview');
  const [stakeAmount, setStakeAmount] = useState('');
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState('usdc');
  const [selectedVault, setSelectedVault] = useState('yield');
  const [vaultAmount, setVaultAmount] = useState('');
  
  // Funções de interação com DeFi
  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para fazer stake.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Stake realizado com sucesso",
      description: `Você fez stake de ${stakeAmount} VCHR tokens.`
    });
    setStakeAmount('');
  };
  
  const handleAddLiquidity = () => {
    if (!liquidityAmount || parseFloat(liquidityAmount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para adicionar liquidez.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Liquidez adicionada com sucesso",
      description: `Você adicionou ${liquidityAmount} ${selectedPool.toUpperCase()} ao pool.`
    });
    setLiquidityAmount('');
  };
  
  const handleVaultDeposit = () => {
    if (!vaultAmount || parseFloat(vaultAmount) <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido para depositar no vault.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Depósito realizado com sucesso",
      description: `Você depositou ${vaultAmount} ${selectedPool.toUpperCase()} no vault de ${selectedVault.toUpperCase()}.`
    });
    setVaultAmount('');
  };
  
  return (
    <div className="bg-muted/30 min-h-screen pb-8">
      <div className="bg-background">
        <div className="container py-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <Layers className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">DeFi Hub</h1>
              <p className="text-sm text-muted-foreground">Serviços Financeiros Descentralizados</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setLocation('/marketplace')}>
              Marketplace
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLocation('/dashboard')}>
              Dashboard
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
          {/* Sidebar de navegação */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant={currentTab === 'overview' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('overview')}
                  >
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Visão Geral
                  </Button>
                  <Button 
                    variant={currentTab === 'staking' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('staking')}
                  >
                    <Coins className="mr-2 h-5 w-5" />
                    Staking de Tokens
                  </Button>
                  <Button 
                    variant={currentTab === 'liquidity' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('liquidity')}
                  >
                    <ArrowRightLeft className="mr-2 h-5 w-5" />
                    Pools de Liquidez
                  </Button>
                  <Button 
                    variant={currentTab === 'yield' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('yield')}
                  >
                    <LineChartIcon className="mr-2 h-5 w-5" />
                    Yield Farming
                  </Button>
                  <Button 
                    variant={currentTab === 'vaults' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('vaults')}
                  >
                    <Database className="mr-2 h-5 w-5" />
                    Vaults
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats do usuário */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Seu Portfólio</CardTitle>
                <CardDescription>Resumo dos seus ativos DeFi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-primary/10">
                      <Coins className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">VCHR Tokens</span>
                  </div>
                  <span className="font-medium">1,250</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-blue-500/10">
                      <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-sm">LP Tokens</span>
                  </div>
                  <span className="font-medium">358</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-green-500/10">
                      <LineChartIcon className="h-4 w-4 text-green-500" />
                    </div>
                    <span className="text-sm">Ganhos (APY)</span>
                  </div>
                  <span className="font-medium">+6.5%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-purple-500/10">
                      <Gift className="h-4 w-4 text-purple-500" />
                    </div>
                    <span className="text-sm">Gift Cards Bloq.</span>
                  </div>
                  <span className="font-medium">8</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center font-medium">
                  <span>Total (USD)</span>
                  <span className="text-lg">$2,345.67</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Ações rápidas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Tokens
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MinusCircle className="mr-2 h-4 w-4" />
                  Retirar Tokens
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar Portfólio
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
                  <h2 className="text-2xl font-bold">Visão Geral DeFi</h2>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Atualizar
                  </Button>
                </div>
                
                <Alert>
                  <ShieldCheck className="h-4 w-4" />
                  <AlertTitle>Acesso Seguro</AlertTitle>
                  <AlertDescription>
                    Todas as transações DeFi são protegidas por contratos inteligentes auditados e provas de conhecimento zero.
                  </AlertDescription>
                </Alert>
                
                {/* Cards de métricas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Bloqueado (TVL)</p>
                          <div className="text-2xl font-bold">$12.45M</div>
                          <p className="text-xs flex items-center text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +8.5% últimos 7 dias
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
                          <Lock className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Rendimento Médio</p>
                          <div className="text-2xl font-bold">6.8% APY</div>
                          <p className="text-xs flex items-center text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +0.3% este mês
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-green-500/10 flex items-center justify-center rounded-full">
                          <LineChartIcon className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Gift Cards em Staking</p>
                          <div className="text-2xl font-bold">4,358</div>
                          <p className="text-xs flex items-center text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +125 última semana
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-purple-500/10 flex items-center justify-center rounded-full">
                          <Gift className="h-6 w-6 text-purple-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Tempo Médio de Bloqueio</p>
                          <div className="text-2xl font-bold">156 dias</div>
                          <p className="text-xs flex items-center text-red-600">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            -3.2% este mês
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-amber-500/10 flex items-center justify-center rounded-full">
                          <Timer className="h-6 w-6 text-amber-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Gráficos e estatísticas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Histórico de APY</CardTitle>
                      <CardDescription>
                        Evolução do rendimento anualizado
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={yieldData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis domain={[5, 7]} />
                            <Tooltip formatter={(value) => [`${value}%`, 'APY']} />
                            <Line 
                              type="monotone" 
                              dataKey="apy" 
                              stroke="#8884d8" 
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Distribuição por Pool</CardTitle>
                      <CardDescription>
                        Alocação de ativos nos pools de liquidez
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={liquidityPoolData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {liquidityPoolData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Crescimento do TVL</CardTitle>
                    <CardDescription>
                      Valor total bloqueado nos vaults ao longo do tempo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={vaultData}
                          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value}k`, 'TVL']} />
                          <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Staking */}
            {currentTab === 'staking' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Staking de Tokens</h2>
                    <p className="text-muted-foreground">
                      Faça stake dos seus tokens VCHR para ganhar recompensas
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Posições Ativas</CardTitle>
                      <CardDescription>
                        Seus tokens atualmente em stake
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">VCHR</Badge>
                              <h3 className="font-medium">Stake VCHR Padrão</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">1,000 VCHR tokens em stake</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">APR: 5.8%</p>
                            <p className="text-xs text-muted-foreground">Bloqueado por: 45 dias</p>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4 flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">VCHR-ETH LP</Badge>
                              <h3 className="font-medium">Stake LP Par</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">250 LP tokens em stake</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">APR: 12.2%</p>
                            <p className="text-xs text-muted-foreground">Bloqueado por: 90 dias</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <div>
                        <p className="text-sm">Total em stake:</p>
                        <p className="font-medium">1,250 tokens</p>
                      </div>
                      <div>
                        <p className="text-sm">Recompensas pendentes:</p>
                        <p className="font-medium text-green-600">+58 VCHR</p>
                      </div>
                      <Button variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Atualizar
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Fazer Stake</CardTitle>
                      <CardDescription>
                        Faça stake dos seus tokens para ganhar rendimentos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="stake-type">Tipo de Stake</Label>
                        <Select defaultValue="vchr">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de stake" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vchr">VCHR Token</SelectItem>
                            <SelectItem value="vchr-eth">VCHR-ETH LP</SelectItem>
                            <SelectItem value="vchr-usdc">VCHR-USDC LP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="stake-amount">Quantidade</Label>
                        <div className="flex space-x-2">
                          <Input 
                            id="stake-amount" 
                            placeholder="0.00" 
                            className="flex-1"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                          />
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Max
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Disponível: 2,500 VCHR</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lock-period">Período de Bloqueio</Label>
                        <Select defaultValue="30">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o período" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 dias (5.5% APR)</SelectItem>
                            <SelectItem value="90">90 dias (7.2% APR)</SelectItem>
                            <SelectItem value="180">180 dias (9.5% APR)</SelectItem>
                            <SelectItem value="365">365 dias (12.0% APR)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="rounded-lg bg-muted p-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Rendimento estimado</span>
                          <span className="font-medium">+7.2% APR</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Recompensas após período</span>
                          <span className="font-medium">+{stakeAmount ? Math.round(parseFloat(stakeAmount) * 0.072 / 4) : 0} VCHR</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button className="w-full" onClick={handleStake}>
                        Fazer Stake
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Distribuição de Staking</CardTitle>
                    <CardDescription>
                      Distribuição das posições de staking na plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stakingData}
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {stakingData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Pools de Liquidez */}
            {currentTab === 'liquidity' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Pools de Liquidez</h2>
                    <p className="text-muted-foreground">
                      Forneça liquidez para ganhar taxas de transação
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Pools Disponíveis</CardTitle>
                      <CardDescription>
                        Pools de liquidez ativos na plataforma
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-[#8884d8] flex items-center justify-center text-white text-xs">V</div>
                                <div className="w-6 h-6 rounded-full bg-[#2775CA] flex items-center justify-center text-white text-xs">U</div>
                              </div>
                              <h3 className="font-medium">VCHR-USDC</h3>
                              <Badge>Popular</Badge>
                            </div>
                            <Button variant="outline" size="sm">
                              Adicionar
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">TVL</p>
                              <p className="font-medium">$4.5M</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">APR</p>
                              <p className="font-medium">24.5%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Volume 24h</p>
                              <p className="font-medium">$850K</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-[#8884d8] flex items-center justify-center text-white text-xs">V</div>
                                <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs">E</div>
                              </div>
                              <h3 className="font-medium">VCHR-ETH</h3>
                            </div>
                            <Button variant="outline" size="sm">
                              Adicionar
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">TVL</p>
                              <p className="font-medium">$2.8M</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">APR</p>
                              <p className="font-medium">18.2%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Volume 24h</p>
                              <p className="font-medium">$420K</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-[#8884d8] flex items-center justify-center text-white text-xs">V</div>
                                <div className="w-6 h-6 rounded-full bg-[#F5AC37] flex items-center justify-center text-white text-xs">D</div>
                              </div>
                              <h3 className="font-medium">VCHR-DAI</h3>
                              <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">Novo</Badge>
                            </div>
                            <Button variant="outline" size="sm">
                              Adicionar
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">TVL</p>
                              <p className="font-medium">$1.2M</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">APR</p>
                              <p className="font-medium">28.6%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Volume 24h</p>
                              <p className="font-medium">$280K</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Adicionar Liquidez</CardTitle>
                      <CardDescription>
                        Forneça tokens para os pools de liquidez
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="pool-type">Selecione o Pool</Label>
                        <Select defaultValue={selectedPool} onValueChange={setSelectedPool}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o pool" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usdc">VCHR-USDC</SelectItem>
                            <SelectItem value="eth">VCHR-ETH</SelectItem>
                            <SelectItem value="dai">VCHR-DAI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="liquidity-amount">Quantidade</Label>
                        <div className="flex space-x-2">
                          <Input 
                            id="liquidity-amount" 
                            placeholder="0.00" 
                            className="flex-1"
                            value={liquidityAmount}
                            onChange={(e) => setLiquidityAmount(e.target.value)}
                          />
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Max
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Disponível: {selectedPool === 'usdc' ? '1,000 USDC' : selectedPool === 'eth' ? '0.5 ETH' : '1,200 DAI'}
                        </p>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Você fornecerá:</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-[#8884d8] flex items-center justify-center text-white text-xs">V</div>
                              <span className="text-sm">VCHR</span>
                            </div>
                            <span className="text-sm font-medium">
                              {liquidityAmount ? parseFloat(liquidityAmount).toFixed(2) : '0.00'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-[#2775CA] flex items-center justify-center text-white text-xs">
                                {selectedPool === 'usdc' ? 'U' : selectedPool === 'eth' ? 'E' : 'D'}
                              </div>
                              <span className="text-sm">{selectedPool.toUpperCase()}</span>
                            </div>
                            <span className="text-sm font-medium">
                              {liquidityAmount ? (parseFloat(liquidityAmount) * (selectedPool === 'eth' ? 0.001 : 1)).toFixed(selectedPool === 'eth' ? 5 : 2) : '0.00'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-lg bg-muted p-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Taxa da plataforma</span>
                          <span className="font-medium">0.3%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>LP tokens recebidos</span>
                          <span className="font-medium">≈ {liquidityAmount ? Math.round(parseFloat(liquidityAmount) * 0.95) : 0}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button className="w-full" onClick={handleAddLiquidity}>
                        Adicionar Liquidez
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Minhas Posições de Liquidez</CardTitle>
                    <CardDescription>
                      Liquidez que você forneceu aos pools
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              <div className="w-6 h-6 rounded-full bg-[#8884d8] flex items-center justify-center text-white text-xs">V</div>
                              <div className="w-6 h-6 rounded-full bg-[#2775CA] flex items-center justify-center text-white text-xs">U</div>
                            </div>
                            <h3 className="font-medium">VCHR-USDC</h3>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Remover</Button>
                            <Button variant="outline" size="sm">Adicionar</Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">LP Tokens</p>
                            <p className="font-medium">358</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Valor</p>
                            <p className="font-medium">$725</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Ganhos</p>
                            <p className="font-medium text-green-600">+$42.5</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">APR</p>
                            <p className="font-medium">24.5%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Yield Farming */}
            {currentTab === 'yield' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Yield Farming</h2>
                    <p className="text-muted-foreground">
                      Maximize seus rendimentos com estratégias de farming
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Estratégias de Yield Farming</CardTitle>
                      <CardDescription>
                        Posicione seus ativos para rendimentos otimizados
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">Estratégia Conservadora</h3>
                                <Badge variant="outline">Baixo Risco</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Foco em pools de stablecoins e staking de longo prazo</p>
                            </div>
                            <Button>Ativar</Button>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">APY Estimado</p>
                              <p className="font-medium">8-12%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Ativos</p>
                              <p className="font-medium">USDC, DAI, VCHR</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Duração</p>
                              <p className="font-medium">90+ dias</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Usuários</p>
                              <p className="font-medium">1,458</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">Estratégia Balanceada</h3>
                                <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">Moderado</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Mix de pools de liquidez e vaults com rendimento otimizado</p>
                            </div>
                            <Button>Ativar</Button>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">APY Estimado</p>
                              <p className="font-medium">15-20%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Ativos</p>
                              <p className="font-medium">VCHR-ETH LP, VCHR</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Duração</p>
                              <p className="font-medium">30-90 dias</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Usuários</p>
                              <p className="font-medium">865</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">Estratégia Agressiva</h3>
                                <Badge variant="outline" className="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">Alto Rendimento</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Foco em farming de alto rendimento e compounding automático</p>
                            </div>
                            <Button>Ativar</Button>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">APY Estimado</p>
                              <p className="font-medium">25-40%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Ativos</p>
                              <p className="font-medium">VCHR, LP Tokens</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Duração</p>
                              <p className="font-medium">7-30 dias</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Usuários</p>
                              <p className="font-medium">342</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Performance do Yield Farming</CardTitle>
                        <CardDescription>
                          Histórico de rendimentos por estratégia
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                {name: 'Sem 1', conservadora: 9.8, balanceada: 16.2, agressiva: 28.5},
                                {name: 'Sem 2', conservadora: 10.1, balanceada: 17.8, agressiva: 32.1},
                                {name: 'Sem 3', conservadora: 9.9, balanceada: 16.5, agressiva: 26.8},
                                {name: 'Sem 4', conservadora: 10.5, balanceada: 18.2, agressiva: 29.7},
                                {name: 'Sem 5', conservadora: 11.2, balanceada: 19.5, agressiva: 33.6},
                                {name: 'Sem 6', conservadora: 11.0, balanceada: 18.8, agressiva: 31.2},
                                {name: 'Sem 7', conservadora: 10.8, balanceada: 17.9, agressiva: 29.8},
                                {name: 'Sem 8', conservadora: 11.5, balanceada: 19.8, agressiva: 36.5},
                              ]}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip formatter={(value) => [`${value}%`, 'APY']} />
                              <Legend />
                              <Line type="monotone" dataKey="conservadora" stroke="#8884d8" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="balanceada" stroke="#82ca9d" activeDot={{ r: 8 }} />
                              <Line type="monotone" dataKey="agressiva" stroke="#ffc658" activeDot={{ r: 8 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Simulador de Rendimentos</CardTitle>
                        <CardDescription>
                          Calcule seus ganhos potenciais
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="initial-investment">Investimento Inicial</Label>
                          <Input id="initial-investment" placeholder="1000" defaultValue="1000" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="apy-rate">Taxa de APY</Label>
                          <Select defaultValue="15">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a taxa de APY" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">10%</SelectItem>
                              <SelectItem value="15">15%</SelectItem>
                              <SelectItem value="20">20%</SelectItem>
                              <SelectItem value="30">30%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="investment-period">Período</Label>
                          <Select defaultValue="365">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o período" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 dias</SelectItem>
                              <SelectItem value="90">90 dias</SelectItem>
                              <SelectItem value="180">180 dias</SelectItem>
                              <SelectItem value="365">365 dias</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="rounded-lg bg-muted p-4 space-y-3">
                          <div className="flex justify-between">
                            <span>Investimento Inicial</span>
                            <span className="font-medium">$1,000.00</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rendimento</span>
                            <span className="font-medium text-green-600">$150.00</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span>Valor Final</span>
                            <span className="font-medium">$1,150.00</span>
                          </div>
                        </div>
                        
                        <Button className="w-full">
                          Recalcular
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
            
            {/* Vaults */}
            {currentTab === 'vaults' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Vaults</h2>
                    <p className="text-muted-foreground">
                      Depósitos otimizados com estratégias automatizadas
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Vaults Disponíveis</CardTitle>
                      <CardDescription>
                        Estratégias de rendimento automatizadas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">Vault de Yield Farmings</h3>
                                <Badge>Popular</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Estratégia automatizada para maximizar rendimentos</p>
                            </div>
                            <Button>Depositar</Button>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">TVL</p>
                              <p className="font-medium">$8.2M</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">APY</p>
                              <p className="font-medium">15.8%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Assets</p>
                              <p className="font-medium">USDC, DAI, USDT</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Harvest</p>
                              <p className="font-medium">Daily</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">Vault de VCHR Staking</h3>
                                <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">Alto APY</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Staking otimizado com recompensas compostas automaticamente</p>
                            </div>
                            <Button>Depositar</Button>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">TVL</p>
                              <p className="font-medium">$3.5M</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">APY</p>
                              <p className="font-medium">22.4%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Assets</p>
                              <p className="font-medium">VCHR</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Harvest</p>
                              <p className="font-medium">Every 8h</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">Vault de LP Tokens</h3>
                                <Badge variant="outline" className="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">Risco Moderado</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Maximize ganhos com tokens LP e mitigação de impermanent loss</p>
                            </div>
                            <Button>Depositar</Button>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">TVL</p>
                              <p className="font-medium">$2.8M</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">APY</p>
                              <p className="font-medium">18.9%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Assets</p>
                              <p className="font-medium">VCHR-ETH, VCHR-USDC</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Harvest</p>
                              <p className="font-medium">Every 12h</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Depositar em Vault</CardTitle>
                      <CardDescription>
                        Coloque seus ativos para trabalhar por você
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="vault-type">Selecione o Vault</Label>
                        <Select defaultValue={selectedVault} onValueChange={setSelectedVault}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o vault" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yield">Yield Farming</SelectItem>
                            <SelectItem value="staking">VCHR Staking</SelectItem>
                            <SelectItem value="lp">LP Tokens</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="asset-type">Ativo para Depósito</Label>
                        <Select defaultValue={selectedPool}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o ativo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usdc">USDC</SelectItem>
                            <SelectItem value="dai">DAI</SelectItem>
                            <SelectItem value="vchr">VCHR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vault-amount">Quantidade</Label>
                        <div className="flex space-x-2">
                          <Input 
                            id="vault-amount" 
                            placeholder="0.00" 
                            className="flex-1"
                            value={vaultAmount}
                            onChange={(e) => setVaultAmount(e.target.value)}
                          />
                          <Button variant="outline" size="sm" className="whitespace-nowrap">
                            Max
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Disponível: {selectedPool === 'usdc' ? '1,000 USDC' : selectedPool === 'dai' ? '1,200 DAI' : '2,500 VCHR'}
                        </p>
                      </div>
                      
                      <div className="rounded-lg bg-muted p-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>APY Estimado</span>
                          <span className="font-medium">
                            {selectedVault === 'yield' ? '15.8%' : selectedVault === 'staking' ? '22.4%' : '18.9%'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Recompensas Diárias</span>
                          <span className="font-medium">
                            ≈ {vaultAmount ? (parseFloat(vaultAmount) * (selectedVault === 'yield' ? 0.158 : selectedVault === 'staking' ? 0.224 : 0.189) / 365).toFixed(2) : '0.00'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Taxa de Withdraw</span>
                          <span className="font-medium">0.1%</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button className="w-full" onClick={handleVaultDeposit}>
                        Depositar no Vault
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance dos Vaults</CardTitle>
                    <CardDescription>
                      Crescimento do valor total bloqueado nos vaults
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={vaultData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value}k`, 'TVL']} />
                          <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                            {vaultData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${240 + index * 5}, 70%, 60%)`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeFi;