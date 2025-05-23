import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, AreaChart, Area
} from 'recharts';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { 
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Users, Building2, 
  CreditCard, ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, 
  Landmark, Search, Download, Plus, FileSpreadsheet, Filter, SlidersHorizontal,
  Wallet, Gift, RefreshCw, ArrowRightLeft, Settings, BarChart2, Calendar,
  ShieldCheck, Clock, Zap, GanttChartSquare, Network, Store
} from 'lucide-react';

// Dados de amostra para os gráficos
const salesData = [
  { name: 'Jan', valor: 4000 },
  { name: 'Fev', valor: 3000 },
  { name: 'Mar', valor: 2000 },
  { name: 'Abr', valor: 2780 },
  { name: 'Mai', valor: 1890 },
  { name: 'Jun', valor: 2390 },
  { name: 'Jul', valor: 3490 },
  { name: 'Ago', valor: 5000 },
  { name: 'Set', valor: 4500 },
  { name: 'Out', valor: 6000 },
  { name: 'Nov', valor: 7000 },
  { name: 'Dez', valor: 9000 },
];

const categoryData = [
  { name: 'E-commerce', valor: 8500 },
  { name: 'Streaming', valor: 5500 },
  { name: 'Varejo', valor: 4500 },
  { name: 'Alimentação', valor: 3500 },
  { name: 'Viagens', valor: 3000 },
  { name: 'Games', valor: 2000 },
];

const merchantData = [
  { id: 1, nome: 'Magazine Luiza', categoria: 'Varejo', totalVendas: 25000, status: 'Ativo' },
  { id: 2, nome: 'Netflix', categoria: 'Streaming', totalVendas: 18000, status: 'Ativo' },
  { id: 3, nome: 'Amazon', categoria: 'E-commerce', totalVendas: 35000, status: 'Ativo' },
  { id: 4, nome: 'iFood', categoria: 'Alimentação', totalVendas: 12000, status: 'Ativo' },
  { id: 5, nome: 'Steam', categoria: 'Games', totalVendas: 9000, status: 'Ativo' },
  { id: 6, nome: 'Decolar', categoria: 'Viagens', totalVendas: 15000, status: 'Ativo' },
  { id: 7, nome: 'Uber', categoria: 'Transporte', totalVendas: 10000, status: 'Ativo' },
  { id: 8, nome: 'Spotify', categoria: 'Streaming', totalVendas: 8500, status: 'Ativo' },
];

const transactionData = [
  { id: 1, data: '15/12/2023', merchant: 'Netflix', tipo: 'Emissão', valor: 2500, status: 'Completo' },
  { id: 2, data: '14/12/2023', merchant: 'Amazon', tipo: 'Resgate', valor: 1500, status: 'Completo' },
  { id: 3, data: '12/12/2023', merchant: 'Magazine Luiza', tipo: 'Recarga', valor: 3000, status: 'Completo' },
  { id: 4, data: '10/12/2023', merchant: 'Spotify', tipo: 'Emissão', valor: 1000, status: 'Completo' },
  { id: 5, data: '09/12/2023', merchant: 'iFood', tipo: 'Resgate', valor: 800, status: 'Completo' },
  { id: 6, data: '07/12/2023', merchant: 'Uber', tipo: 'Emissão', valor: 2000, status: 'Completo' },
  { id: 7, data: '05/12/2023', merchant: 'Steam', tipo: 'Recarga', valor: 1200, status: 'Completo' },
  { id: 8, data: '01/12/2023', merchant: 'Decolar', tipo: 'Emissão', valor: 4000, status: 'Completo' },
];

const pieData = [
  { name: 'Emissão', value: 45, fill: '#8884d8' },
  { name: 'Recarga', value: 25, fill: '#82ca9d' },
  { name: 'Resgate', value: 30, fill: '#ffc658' },
];

// Componente principal do Dashboard B2B
const B2BDashboard = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('visao-geral');
  const [merchantFilter, setMerchantFilter] = useState('');
  const [dateRange, setDateRange] = useState('30d');
  const [isCreatingMerchant, setIsCreatingMerchant] = useState(false);
  
  // Funções do dashboard
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    toast({
      title: "Período atualizado",
      description: `Mostrando dados dos últimos ${range === '7d' ? '7 dias' : range === '30d' ? '30 dias' : '12 meses'}`
    });
  };
  
  const handleExportData = () => {
    toast({
      title: "Exportando dados",
      description: "Os dados estão sendo preparados para exportação."
    });
  };
  
  const handleGenerateReport = () => {
    toast({
      title: "Relatório gerado",
      description: "O relatório foi gerado com sucesso e está disponível para download."
    });
  };
  
  const handleCreateMerchant = () => {
    setIsCreatingMerchant(false);
    toast({
      title: "Merchant criado",
      description: "O novo merchant foi adicionado com sucesso."
    });
  };
  
  const filteredMerchants = merchantData.filter(merchant => 
    merchant.nome.toLowerCase().includes(merchantFilter.toLowerCase()) ||
    merchant.categoria.toLowerCase().includes(merchantFilter.toLowerCase())
  );

  return (
    <div className="bg-muted/30 min-h-screen">
      <div className="bg-background">
        <div className="container py-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Dashboard B2B</h1>
              <p className="text-sm text-muted-foreground">Controle de gestão para parceiros de negócio</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setLocation('/marketplace')}>
              Marketplace
            </Button>
            <Button variant="outline" size="sm" onClick={() => setLocation('/dashboard')}>
              Dashboard Pessoal
            </Button>
            <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">B2B Portal</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Barra lateral com navegação */}
          <div className="lg:w-64 space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  <Button 
                    variant={currentTab === 'visao-geral' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('visao-geral')}
                  >
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Visão Geral
                  </Button>
                  <Button 
                    variant={currentTab === 'merchants' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('merchants')}
                  >
                    <Store className="mr-2 h-5 w-5" />
                    Merchants
                  </Button>
                  <Button 
                    variant={currentTab === 'gift-cards' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('gift-cards')}
                  >
                    <Gift className="mr-2 h-5 w-5" />
                    Gift Cards
                  </Button>
                  <Button 
                    variant={currentTab === 'transacoes' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('transacoes')}
                  >
                    <ArrowRightLeft className="mr-2 h-5 w-5" />
                    Transações
                  </Button>
                  <Button 
                    variant={currentTab === 'relatorios' ? 'default' : 'ghost'} 
                    className="justify-start"
                    onClick={() => setCurrentTab('relatorios')}
                  >
                    <FileSpreadsheet className="mr-2 h-5 w-5" />
                    Relatórios
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Filtro de Período</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-3 gap-1">
                  <Button 
                    variant={dateRange === '7d' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleDateRangeChange('7d')}
                  >
                    7 dias
                  </Button>
                  <Button 
                    variant={dateRange === '30d' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleDateRangeChange('30d')}
                  >
                    30 dias
                  </Button>
                  <Button 
                    variant={dateRange === '12m' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleDateRangeChange('12m')}
                  >
                    12 meses
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Dados
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleGenerateReport}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
                <Dialog open={isCreatingMerchant} onOpenChange={setIsCreatingMerchant}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Merchant
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Merchant</DialogTitle>
                      <DialogDescription>
                        Preencha os dados para adicionar um novo parceiro de negócio.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Nome
                        </Label>
                        <Input id="name" placeholder="Nome da empresa" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                          Categoria
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="e-commerce">E-commerce</SelectItem>
                            <SelectItem value="streaming">Streaming</SelectItem>
                            <SelectItem value="varejo">Varejo</SelectItem>
                            <SelectItem value="alimentacao">Alimentação</SelectItem>
                            <SelectItem value="viagens">Viagens</SelectItem>
                            <SelectItem value="games">Games</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="wallet" className="text-right">
                          Carteira
                        </Label>
                        <Input id="wallet" placeholder="Endereço da carteira" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="verified" className="text-right">
                          Verificado
                        </Label>
                        <div className="flex items-center space-x-2 col-span-3">
                          <Switch id="verified" />
                          <Label htmlFor="verified">Merchant verificado</Label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button onClick={handleCreateMerchant}>Criar Merchant</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
          
          {/* Conteúdo principal do dashboard */}
          <div className="flex-1">
            {/* Visão Geral */}
            {currentTab === 'visao-geral' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Visão Geral do Negócio</h2>
                
                {/* Cards de resumo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Vendas Total</p>
                          <div className="text-2xl font-bold">R$ 154.832</div>
                          <p className="text-xs flex items-center text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +12.5% mês anterior
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
                          <DollarSign className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Gift Cards Emitidos</p>
                          <div className="text-2xl font-bold">2.458</div>
                          <p className="text-xs flex items-center text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +8.2% mês anterior
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-blue-500/10 flex items-center justify-center rounded-full">
                          <Gift className="h-6 w-6 text-blue-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Merchants</p>
                          <div className="text-2xl font-bold">126</div>
                          <p className="text-xs flex items-center text-green-600">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +4 novos merchants
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-purple-500/10 flex items-center justify-center rounded-full">
                          <Store className="h-6 w-6 text-purple-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Taxa de Resgate</p>
                          <div className="text-2xl font-bold">82.3%</div>
                          <p className="text-xs flex items-center text-red-600">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            -2.1% mês anterior
                          </p>
                        </div>
                        <div className="h-12 w-12 bg-amber-500/10 flex items-center justify-center rounded-full">
                          <Wallet className="h-6 w-6 text-amber-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Vendas por Mês</CardTitle>
                      <CardDescription>
                        Volume de vendas de gift cards ao longo do ano
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={salesData}
                            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`R$ ${value}`, 'Valor']} />
                            <Bar dataKey="valor" fill="#8884d8" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Vendas por Categoria</CardTitle>
                      <CardDescription>
                        Volume de vendas por categoria de merchant
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={categoryData}
                            margin={{ top: 10, right: 10, left: 50, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" />
                            <Tooltip formatter={(value) => [`R$ ${value}`, 'Valor']} />
                            <Bar dataKey="valor" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Transações Recentes</CardTitle>
                      <CardDescription>
                        Últimas transações realizadas na plataforma
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Merchant</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactionData.slice(0, 5).map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>#{transaction.id}</TableCell>
                              <TableCell>{transaction.data}</TableCell>
                              <TableCell>{transaction.merchant}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  transaction.tipo === 'Emissão' ? 'default' : 
                                  transaction.tipo === 'Recarga' ? 'outline' : 'secondary'
                                }>
                                  {transaction.tipo}
                                </Badge>
                              </TableCell>
                              <TableCell>R$ {transaction.valor}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                  {transaction.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setCurrentTab('transacoes')}>
                        Ver todas as transações
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tipo de Transações</CardTitle>
                      <CardDescription>
                        Distribuição por tipo de transação
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-60">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, 'Porcentagem']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex justify-center gap-4 mt-2">
                        {pieData.map((entry, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }}></div>
                            <span className="text-xs">{entry.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Merchants */}
            {currentTab === 'merchants' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Gerenciamento de Merchants</h2>
                  <Button onClick={() => setIsCreatingMerchant(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Merchant
                  </Button>
                </div>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Merchants Cadastrados</CardTitle>
                      <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar merchants..."
                          className="pl-9"
                          value={merchantFilter}
                          onChange={(e) => setMerchantFilter(e.target.value)}
                        />
                      </div>
                    </div>
                    <CardDescription>Lista de parceiros de negócio cadastrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Volume de Vendas</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMerchants.map((merchant) => (
                          <TableRow key={merchant.id}>
                            <TableCell>#{merchant.id}</TableCell>
                            <TableCell className="font-medium">{merchant.nome}</TableCell>
                            <TableCell>{merchant.categoria}</TableCell>
                            <TableCell>R$ {merchant.totalVendas.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                {merchant.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <BarChart2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      Mostrando {filteredMerchants.length} de {merchantData.length} merchants
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Anterior
                      </Button>
                      <Button variant="outline" size="sm">
                        Próximo
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Merchants</CardTitle>
                      <CardDescription>
                        Merchants com maior volume de vendas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={merchantData.slice(0, 5).sort((a, b) => b.totalVendas - a.totalVendas)}
                            margin={{ top: 10, right: 20, left: 70, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="nome" type="category" />
                            <Tooltip formatter={(value) => [`R$ ${value}`, 'Volume de Vendas']} />
                            <Bar dataKey="totalVendas" fill="#8884d8" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Taxa de Crescimento</CardTitle>
                      <CardDescription>
                        Crescimento por merchant ao longo do tempo
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              {name: 'Jan', Amazon: 4000, Netflix: 2400, iFood: 1800},
                              {name: 'Fev', Amazon: 4200, Netflix: 2500, iFood: 2000},
                              {name: 'Mar', Amazon: 4500, Netflix: 2700, iFood: 2200},
                              {name: 'Abr', Amazon: 4800, Netflix: 2900, iFood: 2400},
                              {name: 'Mai', Amazon: 5000, Netflix: 3100, iFood: 2600},
                              {name: 'Jun', Amazon: 5500, Netflix: 3300, iFood: 2800},
                            ]}
                            margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`R$ ${value}`, '']} />
                            <Legend />
                            <Line type="monotone" dataKey="Amazon" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="Netflix" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="iFood" stroke="#ffc658" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Gift Cards */}
            {currentTab === 'gift-cards' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Gestão de Gift Cards</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total de Gift Cards</p>
                          <div className="text-2xl font-bold">2.458</div>
                          <p className="text-xs text-muted-foreground">Volume total: R$ 154.832</p>
                        </div>
                        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
                          <Gift className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Gift Cards Ativos</p>
                          <div className="text-2xl font-bold">1.845</div>
                          <p className="text-xs text-muted-foreground">75% do total</p>
                        </div>
                        <div className="h-12 w-12 bg-green-500/10 flex items-center justify-center rounded-full">
                          <Zap className="h-6 w-6 text-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Próximos a Expirar</p>
                          <div className="text-2xl font-bold">126</div>
                          <p className="text-xs text-muted-foreground">Nos próximos 30 dias</p>
                        </div>
                        <div className="h-12 w-12 bg-amber-500/10 flex items-center justify-center rounded-full">
                          <Clock className="h-6 w-6 text-amber-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle className="text-lg">Estatísticas por Tipo</CardTitle>
                      <CardDescription>
                        Volume e quantidade de gift cards por categoria
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Volume (R$)</TableHead>
                            <TableHead>Valor Médio</TableHead>
                            <TableHead>Taxa de Resgate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">E-commerce</TableCell>
                            <TableCell>845</TableCell>
                            <TableCell>R$ 67.600</TableCell>
                            <TableCell>R$ 80,00</TableCell>
                            <TableCell>85%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Streaming</TableCell>
                            <TableCell>612</TableCell>
                            <TableCell>R$ 36.720</TableCell>
                            <TableCell>R$ 60,00</TableCell>
                            <TableCell>92%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Alimentação</TableCell>
                            <TableCell>423</TableCell>
                            <TableCell>R$ 21.150</TableCell>
                            <TableCell>R$ 50,00</TableCell>
                            <TableCell>88%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Varejo</TableCell>
                            <TableCell>356</TableCell>
                            <TableCell>R$ 17.800</TableCell>
                            <TableCell>R$ 50,00</TableCell>
                            <TableCell>79%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Games</TableCell>
                            <TableCell>222</TableCell>
                            <TableCell>R$ 11.100</TableCell>
                            <TableCell>R$ 50,00</TableCell>
                            <TableCell>94%</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Distribuição por Recursos</CardTitle>
                      <CardDescription>
                        Estatísticas por recursos dos gift cards
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
                              <span>Recarregáveis</span>
                            </div>
                            <div className="font-medium">68%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '68%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <ShieldCheck className="h-4 w-4 mr-2 text-purple-500" />
                              <span>Privacidade ZK</span>
                            </div>
                            <div className="font-medium">42%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '42%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-green-500" />
                              <span>Auto-renovação</span>
                            </div>
                            <div className="font-medium">35%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '35%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <Network className="h-4 w-4 mr-2 text-amber-500" />
                              <span>ERC-6551 (Smart)</span>
                            </div>
                            <div className="font-medium">28%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <GanttChartSquare className="h-4 w-4 mr-2 text-red-500" />
                              <span>Geradores de Troco</span>
                            </div>
                            <div className="font-medium">22%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '22%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ciclo de Vida dos Gift Cards</CardTitle>
                    <CardDescription>
                      Análise de tempo de vida, uso e expiração dos gift cards
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            {name: '0', Emitidos: 2458, Ativos: 1845, Expirados: 0},
                            {name: '30', Emitidos: 2458, Ativos: 1750, Expirados: 100},
                            {name: '60', Emitidos: 2458, Ativos: 1650, Expirados: 200},
                            {name: '90', Emitidos: 2458, Ativos: 1500, Expirados: 350},
                            {name: '120', Emitidos: 2458, Ativos: 1350, Expirados: 500},
                            {name: '150', Emitidos: 2458, Ativos: 1200, Expirados: 650},
                            {name: '180', Emitidos: 2458, Ativos: 1000, Expirados: 850},
                            {name: '210', Emitidos: 2458, Ativos: 850, Expirados: 1000},
                            {name: '240', Emitidos: 2458, Ativos: 700, Expirados: 1150},
                            {name: '270', Emitidos: 2458, Ativos: 550, Expirados: 1300},
                            {name: '300', Emitidos: 2458, Ativos: 400, Expirados: 1450},
                            {name: '330', Emitidos: 2458, Ativos: 300, Expirados: 1550},
                            {name: '365', Emitidos: 2458, Ativos: 200, Expirados: 1650},
                          ]}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorEmitidos" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorAtivos" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorExpirados" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" label={{ value: 'Dias', position: 'insideBottomRight', offset: -10 }} />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <Tooltip />
                          <Legend />
                          <Area type="monotone" dataKey="Emitidos" stroke="#8884d8" fillOpacity={1} fill="url(#colorEmitidos)" />
                          <Area type="monotone" dataKey="Ativos" stroke="#82ca9d" fillOpacity={1} fill="url(#colorAtivos)" />
                          <Area type="monotone" dataKey="Expirados" stroke="#ffc658" fillOpacity={1} fill="url(#colorExpirados)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Transações */}
            {currentTab === 'transacoes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Histórico de Transações</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Filter className="h-4 w-4" />
                      Filtrar
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" onClick={handleExportData}>
                      <Download className="h-4 w-4" />
                      Exportar
                    </Button>
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Todas as Transações</CardTitle>
                      <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar transações..."
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <CardDescription>Histórico completo de transações na plataforma</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Merchant</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactionData.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>#{transaction.id}</TableCell>
                            <TableCell>{transaction.data}</TableCell>
                            <TableCell>{transaction.merchant}</TableCell>
                            <TableCell>
                              <Badge variant={
                                transaction.tipo === 'Emissão' ? 'default' : 
                                transaction.tipo === 'Recarga' ? 'outline' : 'secondary'
                              }>
                                {transaction.tipo}
                              </Badge>
                            </TableCell>
                            <TableCell>R$ {transaction.valor}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                {transaction.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      Mostrando {transactionData.length} de 235 transações
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Anterior
                      </Button>
                      <Button variant="outline" size="sm">
                        Próximo
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Volume de Transações</CardTitle>
                      <CardDescription>
                        Volume financeiro de transações por mês
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={salesData.map(item => ({
                              ...item,
                              emissao: item.valor * 0.45,
                              recarga: item.valor * 0.25,
                              resgate: item.valor * 0.30,
                            }))}
                            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`R$ ${value}`, '']} />
                            <Legend />
                            <Line type="monotone" dataKey="emissao" name="Emissão" stroke="#8884d8" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="recarga" name="Recarga" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="resgate" name="Resgate" stroke="#ffc658" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Taxa de Sucesso</CardTitle>
                      <CardDescription>
                        Percentual de transações bem-sucedidas por tipo
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span>Emissão</span>
                            </div>
                            <div className="font-medium">99.8%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: '99.8%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span>Recarga</span>
                            </div>
                            <div className="font-medium">99.5%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '99.5%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span>Resgate</span>
                            </div>
                            <div className="font-medium">98.7%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '98.7%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span>Verificação ZK</span>
                            </div>
                            <div className="font-medium">97.2%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '97.2%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span>Geração de Troco</span>
                            </div>
                            <div className="font-medium">99.4%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '99.4%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span>Liquidação</span>
                            </div>
                            <div className="font-medium">100%</div>
                          </div>
                          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            
            {/* Relatórios */}
            {currentTab === 'relatorios' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
                          <BarChart3 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Relatório de Vendas</h3>
                          <p className="text-sm text-muted-foreground">Análise completa de vendas por período</p>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleGenerateReport}>
                          Gerar Relatório
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 bg-blue-500/10 flex items-center justify-center rounded-full">
                          <Store className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Desempenho de Merchants</h3>
                          <p className="text-sm text-muted-foreground">Análise por merchant e categoria</p>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleGenerateReport}>
                          Gerar Relatório
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 bg-purple-500/10 flex items-center justify-center rounded-full">
                          <Gift className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Uso de Gift Cards</h3>
                          <p className="text-sm text-muted-foreground">Análise de ciclo de vida e uso</p>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleGenerateReport}>
                          Gerar Relatório
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 bg-green-500/10 flex items-center justify-center rounded-full">
                          <LineChartIcon className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Crescimento e Projeções</h3>
                          <p className="text-sm text-muted-foreground">Análise de tendências e projeções</p>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleGenerateReport}>
                          Gerar Relatório
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 bg-amber-500/10 flex items-center justify-center rounded-full">
                          <PieChartIcon className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Segmentação de Mercado</h3>
                          <p className="text-sm text-muted-foreground">Análise de segmentos e públicos</p>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleGenerateReport}>
                          Gerar Relatório
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:border-primary/50 cursor-pointer transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-12 w-12 bg-red-500/10 flex items-center justify-center rounded-full">
                          <ShieldCheck className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">Segurança e Privacidade</h3>
                          <p className="text-sm text-muted-foreground">Análise de segurança e ZK Proofs</p>
                        </div>
                        <Button variant="outline" className="w-full" onClick={handleGenerateReport}>
                          Gerar Relatório
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Relatórios Recentes</CardTitle>
                    <CardDescription>
                      Histórico de relatórios gerados recentemente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome do Relatório</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Gerado por</TableHead>
                          <TableHead>Tamanho</TableHead>
                          <TableHead>Download</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Relatório_Vendas_Dez_2023.xlsx</TableCell>
                          <TableCell>Vendas</TableCell>
                          <TableCell>15/12/2023</TableCell>
                          <TableCell>João Silva</TableCell>
                          <TableCell>1.2 MB</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Análise_Merchants_Q4_2023.pdf</TableCell>
                          <TableCell>Merchants</TableCell>
                          <TableCell>10/12/2023</TableCell>
                          <TableCell>Ana Costa</TableCell>
                          <TableCell>2.4 MB</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Projeções_2024.xlsx</TableCell>
                          <TableCell>Projeções</TableCell>
                          <TableCell>05/12/2023</TableCell>
                          <TableCell>Carlos Mendes</TableCell>
                          <TableCell>1.8 MB</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Análise_Privacidade_ZK.pdf</TableCell>
                          <TableCell>Segurança</TableCell>
                          <TableCell>01/12/2023</TableCell>
                          <TableCell>Mariana Lima</TableCell>
                          <TableCell>3.5 MB</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Gift_Cards_Métricas_Nov_2023.xlsx</TableCell>
                          <TableCell>Gift Cards</TableCell>
                          <TableCell>28/11/2023</TableCell>
                          <TableCell>Pedro Alves</TableCell>
                          <TableCell>1.6 MB</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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

export default B2BDashboard;