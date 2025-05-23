import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useWallet } from '@/hooks/useWallet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Gift, CreditCard, Bell, Coins, Users, Store } from 'lucide-react';

// Dashboard Principal
const Dashboard = () => {
  const [_, setLocation] = useLocation();
  const { isConnected, walletAddress } = useWallet();
  const [currentTab, setCurrentTab] = useState('overview');

  // Verificar se o usuário está autenticado
  useEffect(() => {
    // Se não estiver conectado, redirecionar para login
    if (!isConnected) {
      setLocation('/login');
    }
  }, [isConnected, setLocation]);

  // Buscar dados das notificações não lidas
  const { data: notificationsCount, isLoading: loadingNotifications } = useQuery({
    queryKey: ['/api/users/1/notifications/unread-count'],
    enabled: isConnected,
  });

  // Buscar transações recentes
  const { data: recentTransactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ['/api/transactions/recent'],
    enabled: isConnected,
  });

  // Buscar gift cards do usuário
  const { data: userGiftCards, isLoading: loadingGiftCards } = useQuery({
    queryKey: ['/api/users/1/gift-cards'],
    enabled: isConnected,
  });

  // Buscar pontos de recompensa
  const { data: rewardPoints, isLoading: loadingRewards } = useQuery({
    queryKey: ['/api/users/1/reward-points'],
    enabled: isConnected,
  });

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo(a) ao seu painel de controle de NFT Gift Cards
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="mr-2"
            onClick={() => setLocation('/b2b-dashboard')}
          >
            <Users className="h-4 w-4 mr-2" />
            Acesso B2B
          </Button>
          <div>
            <p className="text-sm font-medium">Carteira Conectada</p>
            <p className="text-xs text-muted-foreground">
              {walletAddress ? 
                `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 
                'Não conectado'}
            </p>
          </div>
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>UR</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gift Cards Ativos</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingGiftCards ? (
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
              ) : (
                userGiftCards?.length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">NFT Gift Cards em sua carteira</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos de Recompensa</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingRewards ? (
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
              ) : (
                rewardPoints?.total || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">$VCHR acumulados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transações</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingTransactions ? (
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
              ) : (
                recentTransactions?.length || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Transações recentes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificações</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingNotifications ? (
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
              ) : (
                notificationsCount?.count || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Notificações não lidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdo em abas */}
      <Tabs 
        defaultValue="overview" 
        value={currentTab} 
        onValueChange={setCurrentTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="gift-cards">Meus Gift Cards</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Bem-vindo ao seu Dashboard</AlertTitle>
            <AlertDescription>
              Aqui você pode gerenciar seus NFT Gift Cards, acompanhar transações e resgatar recompensas.
            </AlertDescription>
          </Alert>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>Últimas atividades na plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTransactions ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : recentTransactions?.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Nenhuma transação encontrada</p>
                ) : (
                  <div className="space-y-4">
                    {recentTransactions?.slice(0, 5).map((tx: any) => (
                      <div key={tx.id} className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${tx.type === 'purchase' ? 'bg-green-100' : tx.type === 'recharge' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                          {tx.type === 'purchase' ? (
                            <CreditCard className="h-4 w-4 text-green-600" />
                          ) : tx.type === 'recharge' ? (
                            <Coins className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Gift className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">{tx.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{tx.totalUsd} USD</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.totalEth} ETH
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Atualizações e alertas</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingNotifications ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : notificationsCount?.count === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Nenhuma notificação não lida</p>
                ) : (
                  <div className="flex justify-between items-center">
                    <p>Você tem {notificationsCount?.count} notificações não lidas</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentTab('notifications')}
                    >
                      Ver todas
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="gift-cards" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Meus NFT Gift Cards</h2>
            <Link href="/marketplace">
              <Button>Explorar Marketplace</Button>
            </Link>
          </div>
          
          {loadingGiftCards ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userGiftCards?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <Gift className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold mb-2">Nenhum Gift Card encontrado</p>
                <p className="text-muted-foreground text-center mb-4">
                  Você ainda não possui NFT Gift Cards. Visite o marketplace para adquirir seu primeiro.
                </p>
                <Link href="/marketplace">
                  <Button>Explorar Marketplace</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userGiftCards?.map((card: any) => (
                <Card key={card.id}>
                  <CardContent className="p-0">
                    <img 
                      src={card.image} 
                      alt={card.title}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold mb-1">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{card.description}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Saldo</p>
                          <p className="text-xs text-muted-foreground">{card.balanceUsd} USD</p>
                        </div>
                        <Button size="sm">Ver Detalhes</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <h2 className="text-xl font-bold">Histórico de Transações</h2>
          
          {loadingTransactions ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : recentTransactions?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold">Nenhuma transação encontrada</p>
                <p className="text-muted-foreground text-center">
                  Não há transações para exibir no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th className="px-6 py-3">Tipo</th>
                        <th className="px-6 py-3">Data</th>
                        <th className="px-6 py-3">Gift Card</th>
                        <th className="px-6 py-3">Valor (USD)</th>
                        <th className="px-6 py-3">Valor (ETH)</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions?.map((tx: any) => (
                        <tr key={tx.id} className="border-b">
                          <td className="px-6 py-4 capitalize">{tx.type}</td>
                          <td className="px-6 py-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">#{tx.giftCardId}</td>
                          <td className="px-6 py-4">{tx.totalUsd} USD</td>
                          <td className="px-6 py-4">{tx.totalEth} ETH</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                              tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="rewards" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Programa de Recompensas</h2>
            <div className="bg-primary/10 text-primary font-medium rounded-lg px-4 py-2">
              {loadingRewards ? (
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
              ) : (
                <>Total: {rewardPoints?.total || 0} pontos</>
              )}
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Como funciona</CardTitle>
              <CardDescription>Sobre o programa de cashback $VCHR</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>O programa de recompensas permite acumular pontos $VCHR através de diversas atividades:</p>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-lg p-4">
                  <div className="bg-primary/10 p-2 rounded-full w-fit mb-3">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Compras</h3>
                  <p className="text-sm text-muted-foreground">
                    Ganhe 5% do valor em pontos ao comprar Gift Cards
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="bg-primary/10 p-2 rounded-full w-fit mb-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Recargas</h3>
                  <p className="text-sm text-muted-foreground">
                    Ganhe 10% do valor em pontos ao recarregar Gift Cards
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="bg-primary/10 p-2 rounded-full w-fit mb-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Indicações</h3>
                  <p className="text-sm text-muted-foreground">
                    Ganhe 50 pontos por cada amigo que se cadastrar
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Button>Resgatar Pontos</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="merchants" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Merchants Parceiros</h2>
            <Button variant="outline">Ver Todos</Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <div className="p-6 flex items-center space-x-4">
                    <div className="bg-muted rounded-full p-3">
                      <Store className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">Merchant {i+1}</h3>
                      <p className="text-sm text-muted-foreground">Categoria</p>
                    </div>
                  </div>
                  <div className="border-t px-6 py-4 flex justify-between items-center">
                    <p className="text-sm font-medium">Gift Cards disponíveis: 10</p>
                    <Button size="sm" variant="outline">Ver Detalhes</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;