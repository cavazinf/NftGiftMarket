import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { NFTGiftCard } from '@/lib/types';
import NFTCard from '@/components/NFTCard';
import CategoryFilter from '@/components/CategoryFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, Filter, SlidersHorizontal, Grid3X3, 
  List, Gift, ShoppingCart, Tag, Store, Wallet,
  CreditCard, Sparkles, ShieldCheck, TrendingUp, Plus
} from 'lucide-react';

// Mock de dados para gift cards
const mockGiftCards: NFTGiftCard[] = [
  {
    id: 1,
    title: 'Amazon Gift Card',
    description: 'Use em milhões de produtos na Amazon',
    image: 'https://m.media-amazon.com/images/G/32/gc/designs/livepreview/amazon_blue_noto_email_v2016_br-main._CB462374749_.png',
    merchant: 'Amazon',
    category: 'E-commerce',
    priceUsd: '50.00',
    priceEth: '0.025',
    isRechargeable: true,
    isPrivacyEnabled: false,
    balanceUsd: '50.00',
    balanceEth: '0.025',
    expiryDate: new Date(2025, 5, 15),
    isVerified: true,
    discount: 5,
    tokenId: '1392745',
    createdAt: new Date(2023, 1, 15),
    usageCount: 0,
    ratings: 4.8,
    reviewCount: 245,
    features: ['Prime Video', 'Amazon Music', 'Kindle'],
    benefits: { cashback: 2, reward_points: 500 }
  },
  {
    id: 2,
    title: 'Netflix Premium',
    description: 'Assista a filmes e séries em 4K',
    image: 'https://cdn.worldvectorlogo.com/logos/netflix-3.svg',
    merchant: 'Netflix',
    category: 'Streaming',
    priceUsd: '25.00',
    priceEth: '0.0125',
    isRechargeable: true,
    isPrivacyEnabled: true,
    balanceUsd: '25.00',
    balanceEth: '0.0125',
    expiryDate: new Date(2024, 11, 31),
    isVerified: true,
    discount: 0,
    tokenId: '2736452',
    createdAt: new Date(2023, 3, 10),
    usageCount: 2,
    ratings: 4.9,
    reviewCount: 189,
    features: ['4K Ultra HD', 'Multi-dispositivos', '4 telas'],
    benefits: { cashback: 1, reward_points: 250 }
  },
  {
    id: 3,
    title: 'Uber VIP',
    description: 'Viagens com motoristas de alta classificação',
    image: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png',
    merchant: 'Uber',
    category: 'Transporte',
    priceUsd: '100.00',
    priceEth: '0.05',
    isRechargeable: true,
    isPrivacyEnabled: true,
    balanceUsd: '100.00',
    balanceEth: '0.05',
    expiryDate: new Date(2024, 8, 20),
    isVerified: true,
    discount: 10,
    tokenId: '3827465',
    createdAt: new Date(2023, 5, 22),
    usageCount: 0,
    ratings: 4.6,
    reviewCount: 78,
    features: ['Uber X', 'Uber Black', 'UberEats'],
    benefits: { cashback: 3, reward_points: 1000 }
  },
  {
    id: 4,
    title: 'Decolar.com Viagens',
    description: 'Use em passagens aéreas, hotéis e pacotes',
    image: 'https://logodownload.org/wp-content/uploads/2018/10/decolar-logo.png',
    merchant: 'Decolar',
    category: 'Viagens',
    priceUsd: '200.00',
    priceEth: '0.1',
    isRechargeable: false,
    isPrivacyEnabled: false,
    balanceUsd: '200.00',
    balanceEth: '0.1',
    expiryDate: new Date(2025, 11, 31),
    isVerified: true,
    discount: 15,
    tokenId: '4918274',
    createdAt: new Date(2023, 7, 5),
    usageCount: 0,
    ratings: 4.5,
    reviewCount: 62,
    features: ['Hotéis', 'Passagens Aéreas', 'Pacotes Turísticos'],
    benefits: { cashback: 5, reward_points: 2000 }
  },
  {
    id: 5,
    title: 'iFood Refeições',
    description: 'Peça comida de milhares de restaurantes',
    image: 'https://logodownload.org/wp-content/uploads/2018/05/ifood-logo.png',
    merchant: 'iFood',
    category: 'Alimentação',
    priceUsd: '30.00',
    priceEth: '0.015',
    isRechargeable: true,
    isPrivacyEnabled: false,
    balanceUsd: '30.00',
    balanceEth: '0.015',
    expiryDate: new Date(2024, 6, 30),
    isVerified: true,
    discount: 8,
    tokenId: '5837264',
    createdAt: new Date(2023, 9, 12),
    usageCount: 1,
    ratings: 4.7,
    reviewCount: 156,
    features: ['Delivery', 'Bebidas', 'Mercado'],
    benefits: { cashback: 2, reward_points: 300 }
  },
  {
    id: 6,
    title: 'Steam Jogos',
    description: 'Compre jogos digitais para PC e Mac',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
    merchant: 'Steam',
    category: 'Games',
    priceUsd: '75.00',
    priceEth: '0.0375',
    isRechargeable: true,
    isPrivacyEnabled: false,
    balanceUsd: '75.00',
    balanceEth: '0.0375',
    expiryDate: new Date(2025, 3, 15),
    isVerified: true,
    discount: 12,
    tokenId: '6748392',
    createdAt: new Date(2023, 10, 8),
    usageCount: 0,
    ratings: 4.9,
    reviewCount: 214,
    features: ['Jogos digitais', 'DLCs', 'Steam Workshop'],
    benefits: { cashback: 4, reward_points: 750 }
  },
  {
    id: 7,
    title: 'Magazine Luiza',
    description: 'Compre eletrônicos, móveis e mais',
    image: 'https://logodownload.org/wp-content/uploads/2014/04/magalu-logo-1.png',
    merchant: 'Magazine Luiza',
    category: 'Varejo',
    priceUsd: '150.00',
    priceEth: '0.075',
    isRechargeable: false,
    isPrivacyEnabled: false,
    balanceUsd: '150.00',
    balanceEth: '0.075',
    expiryDate: new Date(2024, 9, 30),
    isVerified: true,
    discount: 7,
    tokenId: '7493827',
    createdAt: new Date(2023, 11, 25),
    usageCount: 0,
    ratings: 4.6,
    reviewCount: 89,
    features: ['Eletrônicos', 'Móveis', 'Eletrodomésticos'],
    benefits: { cashback: 3, reward_points: 1500 }
  },
  {
    id: 8,
    title: 'Spotify Premium',
    description: 'Música ilimitada sem anúncios',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png',
    merchant: 'Spotify',
    category: 'Streaming',
    priceUsd: '20.00',
    priceEth: '0.01',
    isRechargeable: true,
    isPrivacyEnabled: true,
    balanceUsd: '20.00',
    balanceEth: '0.01',
    expiryDate: new Date(2024, 12, 31),
    isVerified: true,
    discount: 5,
    tokenId: '8327495',
    createdAt: new Date(2023, 12, 15),
    usageCount: 0,
    ratings: 4.8,
    reviewCount: 176,
    features: ['Sem anúncios', 'Qualidade Premium', 'Downloads'],
    benefits: { cashback: 1, reward_points: 200 }
  }
];

// Categorias disponíveis
const categories = [
  'Todos',
  'E-commerce',
  'Streaming',
  'Transporte',
  'Viagens',
  'Alimentação',
  'Games',
  'Varejo'
];

// Opções de classificação
const sortOptions = [
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
  { value: 'popularity', label: 'Mais Populares' },
  { value: 'discount', label: 'Maiores Descontos' }
];

interface MarketplaceProps {
  openNFTModal: (nft: NFTGiftCard) => void;
}

const Marketplace = ({ openNFTModal }: MarketplaceProps) => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Estados para filtros e ordenação
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortOption, setSortOption] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentTab, setCurrentTab] = useState('comprar');
  
  // Estados para filtros avançados
  const [showRechargeable, setShowRechargeable] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showDiscounts, setShowDiscounts] = useState(false);
  const [showVerified, setShowVerified] = useState(true);
  
  // Carrinho de compras
  const [cartItems, setCartItems] = useState<NFTGiftCard[]>([]);
  
  // Filtrar gift cards
  const filteredGiftCards = mockGiftCards.filter(card => {
    // Filtro por busca
    if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !card.merchant.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !card.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filtro por categoria
    if (selectedCategory !== 'Todos' && card.category !== selectedCategory) {
      return false;
    }
    
    // Filtro por preço
    const price = parseFloat(card.priceUsd);
    if (price < priceRange[0] || price > priceRange[1]) {
      return false;
    }
    
    // Filtros avançados
    if (showRechargeable && !card.isRechargeable) return false;
    if (showPrivacy && !card.isPrivacyEnabled) return false;
    if (showDiscounts && (!card.discount || card.discount <= 0)) return false;
    if (showVerified && !card.isVerified) return false;
    
    return true;
  });
  
  // Ordenar gift cards
  const sortedGiftCards = [...filteredGiftCards].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-asc':
        return parseFloat(a.priceUsd) - parseFloat(b.priceUsd);
      case 'price-desc':
        return parseFloat(b.priceUsd) - parseFloat(a.priceUsd);
      case 'popularity':
        return b.reviewCount - a.reviewCount;
      case 'discount':
        return (b.discount || 0) - (a.discount || 0);
      default:
        return 0;
    }
  });
  
  // Adicionar ao carrinho
  const addToCart = (card: NFTGiftCard) => {
    if (!cartItems.some(item => item.id === card.id)) {
      setCartItems([...cartItems, card]);
      
      toast({
        title: 'Gift Card adicionado ao carrinho',
        description: `${card.title} foi adicionado ao seu carrinho.`,
      });
    }
  };
  
  // Remover do carrinho
  const removeFromCart = (cardId: number) => {
    setCartItems(cartItems.filter(item => item.id !== cardId));
  };
  
  // Calcular total do carrinho
  const cartTotal = cartItems.reduce((total, item) => total + parseFloat(item.priceUsd), 0).toFixed(2);
  
  // Finalizar compra
  const checkout = () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione gift cards ao seu carrinho para finalizar a compra.',
        variant: 'destructive'
      });
      return;
    }
    
    // Aqui implementaríamos a lógica de finalização da compra
    toast({
      title: 'Compra realizada com sucesso!',
      description: `Total: $${cartTotal}. Seus gift cards foram adicionados à sua carteira.`
    });
    
    setCartItems([]);
  };
  
  // Criar novo gift card
  const handleCreateGiftCard = () => {
    setLocation('/create-gift-card');
  };
  
  return (
    <div className="container py-6 max-w-screen-xl">
      <h1 className="text-3xl font-bold mb-6">NFT Gift Cards Marketplace</h1>
      
      <Tabs defaultValue="comprar" value={currentTab} onValueChange={setCurrentTab} className="w-full mb-6">
        <TabsList className="mb-4 w-full max-w-md mx-auto">
          <TabsTrigger value="comprar" className="flex-1">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Comprar
          </TabsTrigger>
          <TabsTrigger value="vender" className="flex-1">
            <Tag className="mr-2 h-4 w-4" />
            Vender
          </TabsTrigger>
          <TabsTrigger value="carteira" className="flex-1">
            <Wallet className="mr-2 h-4 w-4" />
            Minha Carteira
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Comprar */}
        <TabsContent value="comprar">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Sidebar com filtros */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Busca */}
                  <div>
                    <Label htmlFor="search" className="text-xs font-medium">Buscar</Label>
                    <div className="relative mt-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Nome, merchant ou descrição..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Categorias */}
                  <div>
                    <Label className="text-xs font-medium mb-2 block">Categorias</Label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`} 
                            checked={selectedCategory === category}
                            onCheckedChange={() => setSelectedCategory(category)}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Faixa de preço */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs font-medium">Faixa de Preço</Label>
                      <span className="text-xs text-muted-foreground">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      min={0}
                      max={200}
                      step={5}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mt-3"
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Filtros avançados */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filtros Avançados
                    </h4>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rechargeable" className="text-sm">Recarregáveis</Label>
                      <Switch
                        id="rechargeable"
                        checked={showRechargeable}
                        onCheckedChange={setShowRechargeable}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="privacy" className="text-sm">Privacidade ZK</Label>
                      <Switch
                        id="privacy"
                        checked={showPrivacy}
                        onCheckedChange={setShowPrivacy}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="discounts" className="text-sm">Com Desconto</Label>
                      <Switch
                        id="discounts"
                        checked={showDiscounts}
                        onCheckedChange={setShowDiscounts}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="verified" className="text-sm">Verificados</Label>
                      <Switch
                        id="verified"
                        checked={showVerified}
                        onCheckedChange={setShowVerified}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Carrinho */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Meu Carrinho
                    {cartItems.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {cartItems.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      Seu carrinho está vazio
                    </p>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
                                <p className="text-xs text-muted-foreground">${item.priceUsd}</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between font-medium">
                        <span>Total:</span>
                        <span>${cartTotal}</span>
                      </div>
                      
                      <Button className="w-full" onClick={checkout}>
                        Finalizar Compra
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Lista de Gift Cards */}
            <div className="lg:col-span-3 space-y-6">
              {/* Controles de visualização e ordenação */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">Ordenar por:</span>
                  <select
                    className="border rounded p-2 text-sm"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="text-sm">
                  {filteredGiftCards.length} gift cards encontrados
                </div>
              </div>
              
              {/* Resultados */}
              {filteredGiftCards.length === 0 ? (
                <Card className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <Search className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Nenhum gift card encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar seus filtros ou termos de busca.
                  </p>
                </Card>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                    : "space-y-4"
                }>
                  {sortedGiftCards.map((card) => (
                    viewMode === 'grid' ? (
                      <NFTCard 
                        key={card.id} 
                        nft={card} 
                        onViewDetails={openNFTModal}
                      />
                    ) : (
                      <Card key={card.id} className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className="w-full sm:w-32 h-32 bg-muted">
                            <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="outline">{card.category}</Badge>
                              {card.isRechargeable && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                  Recarregável
                                </Badge>
                              )}
                              {card.isPrivacyEnabled && (
                                <Badge variant="outline" className="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                                  Privacidade ZK
                                </Badge>
                              )}
                              {card.discount && card.discount > 0 && (
                                <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                  {card.discount}% OFF
                                </Badge>
                              )}
                            </div>
                            
                            <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{card.description}</p>
                            
                            <div className="flex items-end justify-between mt-4">
                              <div>
                                <div className="text-sm text-muted-foreground">Preço:</div>
                                <div className="text-xl font-bold">${card.priceUsd}</div>
                                <div className="text-xs text-muted-foreground">{card.priceEth} ETH</div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openNFTModal(card)}
                                >
                                  Detalhes
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => addToCart(card)}
                                >
                                  Adicionar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Tab Vender */}
        <TabsContent value="vender">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Criar e Vender Gift Cards</CardTitle>
                  <CardDescription>
                    Crie seus próprios NFT Gift Cards e venda-os no marketplace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Gift className="h-5 w-5 mr-2" />
                          Criar Gift Card
                        </CardTitle>
                        <CardDescription>
                          Transforme créditos em NFT Gift Cards
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          Crie gift cards exclusivos com sua marca, defina valores e benefícios.
                        </p>
                        <Button onClick={handleCreateGiftCard} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Novo Gift Card
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center">
                          <Store className="h-5 w-5 mr-2" />
                          Tornar-se Merchant
                        </CardTitle>
                        <CardDescription>
                          Venda gift cards oficiais de sua marca
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          Registre sua empresa e tenha gift cards verificados no marketplace.
                        </p>
                        <Button variant="outline" className="w-full">
                          Saiba Mais
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertDescription>
                      Todos os gift cards passam por verificação antes de serem listados no marketplace.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Meus Gift Cards à Venda</CardTitle>
                  <CardDescription>
                    Gerencie os gift cards que você colocou à venda.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Gift className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Você ainda não criou nenhum gift card para venda</p>
                    <p className="text-sm">Comece a criar seus gift cards agora!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Estatísticas de Vendas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Gift Cards Vendidos</div>
                      <div className="font-medium">0</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-0 rounded-full bg-primary"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Receita Total</div>
                      <div className="font-medium">$0.00</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-0 rounded-full bg-primary"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Avaliação Média</div>
                      <div className="font-medium">N/A</div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-full w-0 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Dicas para Vendedores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm">Ofereça descontos para aumentar suas chances de venda.</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm">Gift cards verificados têm 3x mais chances de serem vendidos.</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <CreditCard className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm">Cartões recarregáveis são mais procurados pelos compradores.</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-sm">Adicione benefícios exclusivos para diferenciar seu gift card.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Tab Carteira */}
        <TabsContent value="carteira">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Meu Saldo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center h-24">
                      <div className="text-center">
                        <div className="text-3xl font-bold">$0.00</div>
                        <div className="text-sm text-muted-foreground">0.00 ETH</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Gift Cards Ativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center items-center h-24">
                      <div className="text-center">
                        <div className="text-3xl font-bold">0</div>
                        <div className="text-sm text-muted-foreground">Nenhum gift card ativo</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Meus Gift Cards</CardTitle>
                  <CardDescription>
                    Gerencie seus gift cards disponíveis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Wallet className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Você ainda não possui gift cards em sua carteira</p>
                    <p className="text-sm mt-2">Compre gift cards no marketplace para começar!</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setCurrentTab('comprar')}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Explorar Marketplace
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Transações</CardTitle>
                  <CardDescription>
                    Visualize todas as suas transações.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Nenhuma transação encontrada</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-4 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Resgatar Gift Card
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Tag className="h-4 w-4 mr-2" />
                    Transferir Gift Card
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    Gerar Troco
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Informações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="font-medium mb-1">Sobre Gift Cards Inativados</h4>
                    <p className="text-sm text-muted-foreground">
                      Gift cards sem uso por mais de 180 dias serão inativados automaticamente.
                    </p>
                  </div>
                  
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="font-medium mb-1">Gerar Troco</h4>
                    <p className="text-sm text-muted-foreground">
                      Ao usar parcialmente um gift card, você pode gerar um novo com o saldo restante.
                    </p>
                  </div>
                  
                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="font-medium mb-1">Resgate Privado</h4>
                    <p className="text-sm text-muted-foreground">
                      Gift cards com privacidade ZK permitem resgates sem revelar sua identidade.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketplace;