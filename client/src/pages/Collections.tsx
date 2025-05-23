import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Star, Grid, List, Filter, Search, TrendingUp, 
  ArrowLeft, Eye, Heart, Share2, ExternalLink,
  Calendar, DollarSign, Users, Award, Sparkles
} from 'lucide-react';

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  totalItems: number;
  floorPrice: number;
  volume24h: number;
  owners: number;
  category: string;
  verified: boolean;
  trending: boolean;
}

interface NFTItem {
  id: string;
  name: string;
  image: string;
  price: number;
  merchant: string;
  collection: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  status: 'active' | 'sold' | 'expired';
}

const Collections = () => {
  const [_, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('volume');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentTab, setCurrentTab] = useState('collections');

  // Mock data para coleções
  const [collections] = useState<Collection[]>([
    {
      id: 'amazon-premium',
      name: 'Amazon Premium Collection',
      description: 'Coleção exclusiva de gift cards Amazon com benefícios especiais e designs únicos.',
      image: 'https://via.placeholder.com/400x300/FF9900/FFFFFF?text=Amazon+Collection',
      creator: 'Amazon Official',
      totalItems: 1250,
      floorPrice: 25.99,
      volume24h: 15420.50,
      owners: 892,
      category: 'E-commerce',
      verified: true,
      trending: true
    },
    {
      id: 'gaming-legends',
      name: 'Gaming Legends',
      description: 'NFT Gift Cards para os maiores jogos e plataformas de gaming do mundo.',
      image: 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Gaming+Legends',
      creator: 'GameHub Studios',
      totalItems: 850,
      floorPrice: 19.99,
      volume24h: 8765.25,
      owners: 567,
      category: 'Games',
      verified: true,
      trending: false
    },
    {
      id: 'streaming-elite',
      name: 'Streaming Elite',
      description: 'Acesso premium aos melhores serviços de streaming em formato NFT.',
      image: 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Streaming+Elite',
      creator: 'StreamCorp',
      totalItems: 650,
      floorPrice: 12.99,
      volume24h: 5432.10,
      owners: 423,
      category: 'Streaming',
      verified: true,
      trending: true
    },
    {
      id: 'coffee-culture',
      name: 'Coffee Culture NFTs',
      description: 'Experiências únicas de café ao redor do mundo em formato de gift cards NFT.',
      image: 'https://via.placeholder.com/400x300/059669/FFFFFF?text=Coffee+Culture',
      creator: 'CoffeeDAO',
      totalItems: 420,
      floorPrice: 8.50,
      volume24h: 2156.75,
      owners: 298,
      category: 'Alimentação',
      verified: false,
      trending: false
    },
    {
      id: 'travel-adventures',
      name: 'Travel Adventures',
      description: 'Gift cards NFT para experiências de viagem e hospedagem exclusivas.',
      image: 'https://via.placeholder.com/400x300/0EA5E9/FFFFFF?text=Travel+Adventures',
      creator: 'TravelVerse',
      totalItems: 780,
      floorPrice: 45.00,
      volume24h: 12890.30,
      owners: 654,
      category: 'Viagens',
      verified: true,
      trending: true
    }
  ]);

  // Mock data para NFTs individuais
  const [nftItems] = useState<NFTItem[]>([
    {
      id: 'amz-001',
      name: 'Amazon Prime Deluxe',
      image: 'https://via.placeholder.com/300x200/FF9900/FFFFFF?text=Prime+Deluxe',
      price: 49.99,
      merchant: 'Amazon',
      collection: 'Amazon Premium Collection',
      rarity: 'legendary',
      status: 'active'
    },
    {
      id: 'game-002',
      name: 'Steam Wallet Supreme',
      image: 'https://via.placeholder.com/300x200/1B2838/FFFFFF?text=Steam+Supreme',
      price: 29.99,
      merchant: 'Steam',
      collection: 'Gaming Legends',
      rarity: 'epic',
      status: 'active'
    },
    {
      id: 'net-003',
      name: 'Netflix Ultra HD',
      image: 'https://via.placeholder.com/300x200/E50914/FFFFFF?text=Netflix+Ultra',
      price: 18.99,
      merchant: 'Netflix',
      collection: 'Streaming Elite',
      rarity: 'rare',
      status: 'active'
    },
    {
      id: 'coffee-004',
      name: 'Starbucks Gold Card',
      image: 'https://via.placeholder.com/300x200/00704A/FFFFFF?text=Starbucks+Gold',
      price: 15.50,
      merchant: 'Starbucks',
      collection: 'Coffee Culture NFTs',
      rarity: 'rare',
      status: 'active'
    }
  ]);

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || collection.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedCollections = [...filteredCollections].sort((a, b) => {
    switch (sortBy) {
      case 'volume':
        return b.volume24h - a.volume24h;
      case 'floor':
        return b.floorPrice - a.floorPrice;
      case 'items':
        return b.totalItems - a.totalItems;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-7xl py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation('/marketplace')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Marketplace
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Coleções NFT Gift Cards
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore coleções exclusivas de NFT Gift Cards criadas pelos melhores artistas e marcas
          </p>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar coleções ou criadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48 h-12">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              <SelectItem value="E-commerce">E-commerce</SelectItem>
              <SelectItem value="Games">Games</SelectItem>
              <SelectItem value="Streaming">Streaming</SelectItem>
              <SelectItem value="Alimentação">Alimentação</SelectItem>
              <SelectItem value="Viagens">Viagens</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 h-12">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volume">Volume 24h</SelectItem>
              <SelectItem value="floor">Preço Base</SelectItem>
              <SelectItem value="items">Total de Itens</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="collections" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Coleções
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              NFTs Individuais
            </TabsTrigger>
          </TabsList>

          {/* Tab Coleções */}
          <TabsContent value="collections">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCollections.map((collection) => (
                  <Card key={collection.id} className="shadow-xl hover:shadow-2xl transition-all cursor-pointer group">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img 
                        src={collection.image} 
                        alt={collection.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {collection.verified && (
                          <Badge className="bg-blue-500 text-white">
                            <Award className="h-3 w-3 mr-1" />
                            Verificado
                          </Badge>
                        )}
                        {collection.trending && (
                          <Badge className="bg-red-500 text-white">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{collection.name}</h3>
                          <p className="text-sm text-muted-foreground">por {collection.creator}</p>
                        </div>
                        <Badge variant="secondary">{collection.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {collection.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Itens</p>
                          <p className="font-semibold">{collection.totalItems.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Proprietários</p>
                          <p className="font-semibold">{collection.owners.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Preço Base</p>
                          <p className="font-semibold">${collection.floorPrice}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Volume 24h</p>
                          <p className="font-semibold">${collection.volume24h.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button className="flex-1" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Coleção
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedCollections.map((collection) => (
                  <Card key={collection.id} className="shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <img 
                          src={collection.image} 
                          alt={collection.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg">{collection.name}</h3>
                            {collection.verified && <Award className="h-4 w-4 text-blue-500" />}
                            {collection.trending && <TrendingUp className="h-4 w-4 text-red-500" />}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">por {collection.creator}</p>
                          <p className="text-sm">{collection.description}</p>
                        </div>
                        <div className="grid grid-cols-4 gap-6 text-center text-sm">
                          <div>
                            <p className="text-muted-foreground">Itens</p>
                            <p className="font-semibold">{collection.totalItems.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Preço Base</p>
                            <p className="font-semibold">${collection.floorPrice}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Volume 24h</p>
                            <p className="font-semibold">${collection.volume24h.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Proprietários</p>
                            <p className="font-semibold">{collection.owners.toLocaleString()}</p>
                          </div>
                        </div>
                        <Button>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab NFTs Individuais */}
          <TabsContent value="items">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nftItems.map((nft) => (
                <Card key={nft.id} className="shadow-xl hover:shadow-2xl transition-all cursor-pointer">
                  <div className="relative">
                    <img 
                      src={nft.image} 
                      alt={nft.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)}`}>
                      {nft.rarity}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{nft.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{nft.collection}</p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Preço</p>
                        <p className="font-bold text-lg">${nft.price}</p>
                      </div>
                      <Badge variant={nft.status === 'active' ? 'default' : 'secondary'}>
                        {nft.status}
                      </Badge>
                    </div>
                    
                    <Button className="w-full mt-4" size="sm">
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Collections;