import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/hooks/useWallet';
import { 
  ArrowLeft, QrCode, Wallet, Building2, Zap, 
  Users, TrendingUp, Shield, Star, ExternalLink,
  CheckCircle, Clock, Smartphone, Globe, Code
} from 'lucide-react';

interface DApp {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  category: 'B2B' | 'B2C' | 'Fintech' | 'Tools';
  status: 'active' | 'beta' | 'coming_soon';
  features: string[];
  users: number;
  rating: number;
  image: string;
  color: string;
}

const DApps = () => {
  const [_, setLocation] = useLocation();
  const { isConnected } = useWallet();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const dapps: DApp[] = [
    {
      id: 'b2b-scanner',
      name: 'B2B Scanner',
      description: 'Scanner QR para comerciantes processarem pagamentos com NFT Gift Cards em tempo real.',
      icon: <QrCode className="h-8 w-8" />,
      route: '/b2b-scanner',
      category: 'B2B',
      status: 'active',
      features: ['Scanner QR Code', 'Processamento de Pagamentos', 'Gestão de Troco', 'Relatórios'],
      users: 1250,
      rating: 4.8,
      image: 'https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=B2B+Scanner',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'b2c-wallet',
      name: 'B2C Wallet',
      description: 'Carteira pessoal para consumidores gerenciarem seus NFT Gift Cards e fazerem pagamentos.',
      icon: <Wallet className="h-8 w-8" />,
      route: '/b2c-wallet',
      category: 'B2C',
      status: 'active',
      features: ['Carteira Digital', 'QR Code Generator', 'Histórico de Transações', 'Recargas'],
      users: 8750,
      rating: 4.9,
      image: 'https://via.placeholder.com/400x200/8B5CF6/FFFFFF?text=B2C+Wallet',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'fintech-dapp',
      name: 'Fintech DApp',
      description: 'Plataforma de processamento financeiro com gestão inteligente de saldos e trocos.',
      icon: <Building2 className="h-8 w-8" />,
      route: '/fintech-dapp',
      category: 'Fintech',
      status: 'active',
      features: ['Processamento de Pagamentos', 'Analytics', 'Gestão de Saldos', 'API Integration'],
      users: 450,
      rating: 4.7,
      image: 'https://via.placeholder.com/400x200/10B981/FFFFFF?text=Fintech+DApp',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'defi-platform',
      name: 'DeFi Platform',
      description: 'Plataforma DeFi para staking, liquidity mining e yield farming com NFT Gift Cards.',
      icon: <TrendingUp className="h-8 w-8" />,
      route: '/defi',
      category: 'Tools',
      status: 'active',
      features: ['Staking de Tokens', 'Liquidity Pools', 'Yield Farming', 'Governance'],
      users: 2100,
      rating: 4.6,
      image: 'https://via.placeholder.com/400x200/F59E0B/FFFFFF?text=DeFi+Platform',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'zk-privacy',
      name: 'ZK Privacy',
      description: 'Ferramentas de privacidade com zero-knowledge proofs para transações anônimas.',
      icon: <Shield className="h-8 w-8" />,
      route: '/zk-privacy',
      category: 'Tools',
      status: 'active',
      features: ['Zero-Knowledge Proofs', 'Transações Privadas', 'Anonimato', 'Segurança'],
      users: 890,
      rating: 4.9,
      image: 'https://via.placeholder.com/400x200/6B7280/FFFFFF?text=ZK+Privacy',
      color: 'from-gray-500 to-slate-600'
    },
    {
      id: 'nft-creator',
      name: 'NFT Creator Studio',
      description: 'Estúdio completo para criação e customização de NFT Gift Cards.',
      icon: <Zap className="h-8 w-8" />,
      route: '/create',
      category: 'Tools',
      status: 'active',
      features: ['Criação de NFTs', 'Templates', 'Customização', 'Batch Creation'],
      users: 3200,
      rating: 4.8,
      image: 'https://via.placeholder.com/400x200/EF4444/FFFFFF?text=NFT+Creator',
      color: 'from-red-500 to-pink-500'
    }
  ];

  const categories = ['all', 'B2B', 'B2C', 'Fintech', 'Tools'];

  const filteredDApps = selectedCategory === 'all' 
    ? dapps 
    : dapps.filter(dapp => dapp.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'beta': return 'bg-yellow-500';
      case 'coming_soon': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'beta': return 'Beta';
      case 'coming_soon': return 'Em Breve';
      default: return 'Desconhecido';
    }
  };

  const navigateToDApp = (route: string) => {
    if (!isConnected && route !== '/create') {
      setLocation('/login');
      return;
    }
    setLocation(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-7xl py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation('/marketplace')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Marketplace
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-700 to-gray-600 bg-clip-text text-transparent">
            Ecossistema DApps
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore nossa suite completa de aplicações descentralizadas para NFT Gift Cards
          </p>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <CardContent className="p-6 text-center">
              <Code className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{dapps.length}</p>
              <p className="text-blue-100">DApps Disponíveis</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">{dapps.reduce((sum, dapp) => sum + dapp.users, 0).toLocaleString()}</p>
              <p className="text-green-100">Usuários Ativos</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">98.5%</p>
              <p className="text-purple-100">Uptime</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2" />
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-orange-100">Avaliação Média</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros por Categoria */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === 'all' ? 'Todos' : category}
            </Button>
          ))}
        </div>

        {/* Grid de DApps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDApps.map((dapp) => (
            <Card key={dapp.id} className="shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
              <div className="relative overflow-hidden">
                <img 
                  src={dapp.image} 
                  alt={dapp.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className={`${getStatusColor(dapp.status)} text-white`}>
                    {getStatusText(dapp.status)}
                  </Badge>
                  <Badge variant="secondary">{dapp.category}</Badge>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{dapp.rating}</span>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${dapp.color} flex items-center justify-center text-white`}>
                    {dapp.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{dapp.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{dapp.users.toLocaleString()} usuários</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {dapp.description}
                </p>
                
                <div className="space-y-2">
                  <p className="font-medium text-sm">Principais Recursos:</p>
                  <div className="flex flex-wrap gap-1">
                    {dapp.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {dapp.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{dapp.features.length - 3} mais
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => navigateToDApp(dapp.route)}
                    className={`flex-1 bg-gradient-to-r ${dapp.color} hover:opacity-90`}
                    disabled={dapp.status === 'coming_soon'}
                  >
                    {dapp.status === 'coming_soon' ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Em Breve
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Abrir DApp
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12">
          <Alert className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 dark:from-blue-950/30 dark:to-cyan-950/30">
            <Smartphone className="h-4 w-4" />
            <AlertDescription>
              <strong>Aplicações Móveis:</strong> Todos os nossos DApps são otimizados para dispositivos móveis e funcionam perfeitamente em qualquer navegador moderno. Alguns também possuem apps nativos disponíveis.
            </AlertDescription>
          </Alert>
        </div>

        {/* Status de Conectividade */}
        {!isConnected && (
          <div className="mt-6">
            <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Conecte sua carteira</strong> para acessar todas as funcionalidades dos DApps. Alguns recursos podem estar limitados sem uma carteira conectada.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default DApps;