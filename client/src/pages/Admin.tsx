import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useWallet } from '@/hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, Store, CreditCard, Shield, BarChart3, Gift, Plus, 
  Pencil, Trash2, Search, Download, ArrowUpDown, ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Loader2 } from 'lucide-react';

// Admin Dashboard Principal
const Admin = () => {
  const [_, setLocation] = useLocation();
  const { isConnected, walletAddress } = useWallet();
  const [currentTab, setCurrentTab] = useState('overview');
  const [isAdminUser, setIsAdminUser] = useState(true); // Mock admin verification

  // Verificar se o usuário está autenticado e é admin
  useEffect(() => {
    // Se não estiver conectado, redirecionar para login
    if (!isConnected) {
      setLocation('/login');
    }
    
    // Em um ambiente real, verificaríamos se o usuário tem permissão de admin
    // Simulando um check de admin (em produção, viria do backend)
    const checkAdminStatus = async () => {
      // Simulação de verificação via API
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsAdminUser(true);
    };
    
    if (isConnected) {
      checkAdminStatus();
    }
  }, [isConnected, setLocation]);

  // Buscar estatísticas do sistema
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: isConnected && isAdminUser,
  });

  // Buscar usuários
  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['/api/admin/users'],
    enabled: isConnected && isAdminUser && currentTab === 'users',
  });

  // Buscar merchants
  const { data: merchants, isLoading: loadingMerchants } = useQuery({
    queryKey: ['/api/admin/merchants'],
    enabled: isConnected && isAdminUser && currentTab === 'merchants',
  });

  // Buscar gift cards
  const { data: giftCards, isLoading: loadingGiftCards } = useQuery({
    queryKey: ['/api/admin/gift-cards'],
    enabled: isConnected && isAdminUser && currentTab === 'gift-cards',
  });

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="container py-8 text-center">
        <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Acesso Restrito</h1>
        <p className="text-muted-foreground mb-4">
          Você não tem permissão para acessar o painel administrativo.
        </p>
        <Button onClick={() => setLocation('/dashboard')}>
          Voltar para Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <h2 className="text-lg font-semibold">NFTGift Admin</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Admin
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/dashboard')}>
                  Dashboard de Usuário
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation('/')}>
                  Site Principal
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <div className="container grid md:grid-cols-[240px_1fr] gap-6 py-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Button 
              variant={currentTab === 'overview' ? "default" : "ghost"} 
              className="justify-start" 
              onClick={() => setCurrentTab('overview')}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Visão Geral
            </Button>
            <Button 
              variant={currentTab === 'users' ? "default" : "ghost"} 
              className="justify-start"
              onClick={() => setCurrentTab('users')}
            >
              <Users className="mr-2 h-5 w-5" />
              Usuários
            </Button>
            <Button 
              variant={currentTab === 'merchants' ? "default" : "ghost"} 
              className="justify-start"
              onClick={() => setCurrentTab('merchants')}
            >
              <Store className="mr-2 h-5 w-5" />
              Merchants
            </Button>
            <Button 
              variant={currentTab === 'gift-cards' ? "default" : "ghost"} 
              className="justify-start"
              onClick={() => setCurrentTab('gift-cards')}
            >
              <Gift className="mr-2 h-5 w-5" />
              Gift Cards
            </Button>
            <Button 
              variant={currentTab === 'transactions' ? "default" : "ghost"} 
              className="justify-start"
              onClick={() => setCurrentTab('transactions')}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Transações
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="justify-start">
              <Shield className="mr-2 h-5 w-5" />
              Configurações
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          {currentTab === 'overview' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Visão Geral</h2>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Relatório
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Usuários Totais</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingStats ? "..." : "421"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +5 novos usuários hoje
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Merchants</CardTitle>
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingStats ? "..." : "56"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +2 novos merchants esta semana
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gift Cards Ativos</CardTitle>
                    <Gift className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingStats ? "..." : "1,245"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +18 novos gift cards hoje
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Volume de Transações</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loadingStats ? "..." : "$12,456"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12% em relação ao mês anterior
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Transações Recentes</CardTitle>
                    <CardDescription>
                      As 5 últimas transações na plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <TableRow key={i}>
                            <TableCell>
                              {Math.random() > 0.5 ? "Compra" : "Recarga"}
                            </TableCell>
                            <TableCell>
                              ${Math.floor(Math.random() * 500 + 10)}
                            </TableCell>
                            <TableCell>
                              {new Date().toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">
                                Completa
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>ZK Proofs Recentes</CardTitle>
                    <CardDescription>
                      Estatísticas de provas de privacidade
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Provas Verificadas</div>
                          <div className="text-sm text-muted-foreground">85%</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[85%] rounded-full bg-primary"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Falhas de Verificação</div>
                          <div className="text-sm text-muted-foreground">15%</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[15%] rounded-full bg-destructive"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Tempo Médio de Verificação</div>
                          <div className="text-sm text-muted-foreground">2.3s</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div className="h-full w-[65%] rounded-full bg-amber-500"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
          
          {currentTab === 'users' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
                <div className="flex items-center gap-2">
                  <div className="relative w-60">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar usuários..." className="pl-9" />
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Usuário
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Carteira</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <TableRow key={i}>
                          <TableCell>{i}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>U{i}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">Usuário {i}</div>
                                <div className="text-xs text-muted-foreground">
                                  @usuario{i}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>usuario{i}@exemplo.com</TableCell>
                          <TableCell className="font-mono text-xs">
                            0x1a2b...3c4d
                          </TableCell>
                          <TableCell>
                            <Badge variant={i === 1 ? "default" : "secondary"}>
                              {i === 1 ? "Admin" : "Usuário"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <div className="text-xs text-muted-foreground">
                    Mostrando 8 de 421 usuários
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
            </>
          )}
          
          {currentTab === 'merchants' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gerenciar Merchants</h2>
                <div className="flex items-center gap-2">
                  <div className="relative w-60">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar merchants..." className="pl-9" />
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Merchant
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Merchant</TableHead>
                        <TableHead>Categorias</TableHead>
                        <TableHead>Carteira</TableHead>
                        <TableHead>Gift Cards</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <TableRow key={i}>
                          <TableCell>{i}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>M{i}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">Merchant {i}</div>
                                <div className="text-xs text-muted-foreground">
                                  merchant{i}.com
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Badge variant="outline">Restaurantes</Badge>
                              <Badge variant="outline">Entretenimento</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            0x3d4c...5e6f
                          </TableCell>
                          <TableCell>{Math.floor(Math.random() * 50)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                i % 3 === 0 ? "outline" : 
                                i % 3 === 1 ? "secondary" : "default"
                              }>
                                {i % 3 === 0 ? "Pendente" : 
                                 i % 3 === 1 ? "Verificado" : "Destaque"}
                              </Badge>
                              <Switch checked={i % 3 !== 0} />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <div className="text-xs text-muted-foreground">
                    Mostrando 5 de 56 merchants
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
            </>
          )}
          
          {currentTab === 'gift-cards' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Gerenciar Gift Cards</h2>
                <div className="flex items-center gap-2">
                  <div className="relative w-60">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar gift cards..." className="pl-9" />
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Gift Card
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            ID
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Gift Card</TableHead>
                        <TableHead>Merchant</TableHead>
                        <TableHead>Preço (USD)</TableHead>
                        <TableHead>Recursos</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <TableRow key={i}>
                          <TableCell>{i}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-16 rounded bg-muted"></div>
                              <div>
                                <div className="font-medium">Gift Card #{i}</div>
                                <div className="text-xs text-muted-foreground">
                                  TokenId: #{1000 + i}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>Merchant {Math.ceil(i/2)}</TableCell>
                          <TableCell>${Math.floor(Math.random() * 100) + 10}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {i % 2 === 0 && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
                                  Recarga
                                </Badge>
                              )}
                              {i % 3 === 0 && (
                                <Badge variant="outline" className="bg-purple-50 text-purple-600 hover:bg-purple-50">
                                  Privacidade
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              i % 4 === 0 ? "outline" : 
                              i % 4 === 1 ? "secondary" : 
                              i % 4 === 2 ? "default" : "destructive"
                            }>
                              {i % 4 === 0 ? "Rascunho" : 
                               i % 4 === 1 ? "Ativo" : 
                               i % 4 === 2 ? "Destaque" : "Esgotado"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <div className="text-xs text-muted-foreground">
                    Mostrando 6 de 1,245 gift cards
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
            </>
          )}
          
          {currentTab === 'transactions' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Histórico de Transações</h2>
                <div className="flex items-center gap-2">
                  <div className="relative w-60">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar transações..." className="pl-9" />
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar CSV
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            ID
                            <ArrowUpDown className="h-3 w-3" />
                          </div>
                        </TableHead>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Gift Card</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <TableRow key={i}>
                          <TableCell>{i}</TableCell>
                          <TableCell>
                            <div>
                              <div>
                                {new Date().toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date().toLocaleTimeString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>Usuário {Math.floor(Math.random() * 10) + 1}</TableCell>
                          <TableCell>Gift Card #{Math.floor(Math.random() * 100) + 1}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              i % 3 === 0 ? "bg-green-50 text-green-600 hover:bg-green-50" :
                              i % 3 === 1 ? "bg-blue-50 text-blue-600 hover:bg-blue-50" :
                              "bg-purple-50 text-purple-600 hover:bg-purple-50"
                            }>
                              {i % 3 === 0 ? "Compra" : 
                               i % 3 === 1 ? "Recarga" : "Resgate"}
                            </Badge>
                          </TableCell>
                          <TableCell>${Math.floor(Math.random() * 500) + 10}</TableCell>
                          <TableCell>
                            <Badge variant={
                              i % 4 === 0 ? "outline" : 
                              i % 4 === 1 ? "secondary" : 
                              i % 4 === 2 ? "default" : "destructive"
                            }>
                              {i % 4 === 0 ? "Pendente" : 
                               i % 4 === 1 ? "Completa" : 
                               i % 4 === 2 ? "Confirmada" : "Falha"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <div className="text-xs text-muted-foreground">
                    Mostrando 10 de 4,235 transações
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;