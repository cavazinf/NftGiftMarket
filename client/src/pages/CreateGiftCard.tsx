import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useNFTContract } from '@/hooks/useNFTContract';
import { useWallet } from '@/hooks/useWallet';
import { 
  Gift, Shield, Wallet, Sparkles, CreditCard, 
  ArrowLeft, Upload, ArrowRight, Check, AlertCircle, 
  RefreshCw, LockKeyhole, BadgePercent, Landmark,
  Eye, Key, BarChart3, Coins, DollarSign
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const CreateGiftCard = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { mintGiftCard, isLoading: isMinting, isContractReady } = useNFTContract();
  const { walletAddress, isConnected } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentTab, setCurrentTab] = useState('novo');
  const [isMintingNFT, setIsMintingNFT] = useState(false);
  
  // Dados do gift card
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [priceUsd, setPriceUsd] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isRechargeable, setIsRechargeable] = useState(true);
  const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [discount, setDiscount] = useState([0]);
  const [benefitCashback, setBenefitCashback] = useState([0]);
  const [benefitPoints, setBenefitPoints] = useState([0]);
  const [autoRenewal, setAutoRenewal] = useState(false);
  
  // Para Criação de troco
  const [originalBalance, setOriginalBalance] = useState('');
  const [usedAmount, setUsedAmount] = useState('');
  const [changeAmount, setChangeAmount] = useState('0.00');
  
  // Validação
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Função para validar os campos do formulário
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!title) newErrors.title = 'O título é obrigatório';
    if (!description) newErrors.description = 'A descrição é obrigatória';
    if (!merchant) newErrors.merchant = 'O comerciante é obrigatório';
    if (!category) newErrors.category = 'A categoria é obrigatória';
    if (!priceUsd) newErrors.priceUsd = 'O valor é obrigatório';
    else if (isNaN(parseFloat(priceUsd)) || parseFloat(priceUsd) <= 0) {
      newErrors.priceUsd = 'O valor deve ser um número positivo';
    }
    if (!expiryDate) newErrors.expiryDate = 'A data de expiração é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Função para avançar para o próximo passo
  const nextStep = () => {
    if (currentStep === 1 && !validateForm()) {
      toast({
        title: 'Erro na validação',
        description: 'Por favor, preencha todos os campos obrigatórios corretamente.',
        variant: 'destructive'
      });
      return;
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Função para voltar ao passo anterior
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Calcular valor de ETH (simulação)
  const calculateEth = (usd: string) => {
    const usdValue = parseFloat(usd || '0');
    return (usdValue * 0.0005).toFixed(6);
  };
  
  // Calcular valor de troco
  const calculateChange = () => {
    const original = parseFloat(originalBalance || '0');
    const used = parseFloat(usedAmount || '0');
    if (isNaN(original) || isNaN(used) || used > original) {
      setChangeAmount('0.00');
      return;
    }
    setChangeAmount((original - used).toFixed(2));
  };
  
  // Preparar os recursos para listagem
  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setFeatures([...features, feature]);
    } else {
      setFeatures(features.filter(f => f !== feature));
    }
  };
  
  // Finalizar criação com mintagem de NFT
  const finishCreation = async () => {
    if (!isConnected) {
      toast({
        title: 'Carteira não conectada',
        description: 'Conecte sua carteira para criar o NFT Gift Card.',
        variant: 'destructive'
      });
      return;
    }

    if (!isContractReady) {
      toast({
        title: 'Contrato não disponível',
        description: 'O contrato inteligente não está disponível. Tente novamente.',
        variant: 'destructive'
      });
      return;
    }

    setIsMintingNFT(true);
    
    try {
      // Criar metadata JSON para o NFT
      const metadata = JSON.stringify({
        name: title,
        description: description,
        image: image || 'https://via.placeholder.com/400x300?text=Gift+Card',
        attributes: [
          { trait_type: "Category", value: category },
          { trait_type: "Merchant", value: merchant },
          { trait_type: "Value USD", value: priceUsd },
          { trait_type: "Rechargeable", value: isRechargeable ? "Yes" : "No" },
          { trait_type: "Privacy Enabled", value: isPrivacyEnabled ? "Yes" : "No" },
          { trait_type: "Features", value: features.join(", ") }
        ]
      });

      // Calcular dias até expiração
      const expirationDays = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      // Token URI (em produção, seria armazenado em IPFS)
      const tokenURI = `data:application/json;base64,${btoa(metadata)}`;

      // Mintar o NFT
      const result = await mintGiftCard(
        walletAddress!, // Destinatário
        merchant, // Nome do comerciante
        category, // Categoria
        parseFloat(priceUsd), // Valor em ETH
        isRechargeable, // É recarregável
        expirationDays, // Dias para expiração
        tokenURI, // URI dos metadados
        metadata // Metadados adicionais
      );

      toast({
        title: 'NFT Gift Card criado com sucesso! 🎉',
        description: `Token ID: ${result.tokenId} | Hash: ${result.transactionHash?.slice(0, 10)}...`
      });

      // Salvar no banco de dados local também
      // Aqui você pode adicionar uma chamada para a API para salvar no banco
      
      setTimeout(() => {
        setLocation('/marketplace');
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao criar NFT:', error);
      toast({
        title: 'Erro ao criar NFT Gift Card',
        description: error.message || 'Ocorreu um erro durante a criação. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsMintingNFT(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-6xl py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation('/marketplace')} className="gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Marketplace
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Criar NFT Gift Card
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transforme créditos em NFT Gift Cards com baixo custo de emissão e recursos avançados
          </p>
        </div>
        
        <Tabs defaultValue="novo" value={currentTab} onValueChange={setCurrentTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6 h-12">
            <TabsTrigger value="novo" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Novo Gift Card
            </TabsTrigger>
            <TabsTrigger value="troco" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Gerar Troco
            </TabsTrigger>
            <TabsTrigger value="comerciante" className="flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              Para Comerciantes
            </TabsTrigger>
          </TabsList>
          
          {/* Tab: Novo Gift Card */}
          <TabsContent value="novo">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              {/* Cabeçalho com passos */}
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center items-center mb-6">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((step, index) => (
                      <div key={step} className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                          currentStep >= step 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }`}>
                          {currentStep > step ? <Check className="h-5 w-5" /> : step}
                        </div>
                        {index < 3 && (
                          <div className={`h-1 w-12 mx-2 transition-all ${
                            currentStep > step ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                          }`}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <CardTitle className="text-2xl">
                  {currentStep === 1 && 'Informações Básicas'}
                  {currentStep === 2 && 'Recursos e Benefícios'}
                  {currentStep === 3 && 'Configurações Avançadas'}
                  {currentStep === 4 && 'Revisão e Confirmação'}
                </CardTitle>
                <CardDescription className="text-base">
                  {currentStep === 1 && 'Defina os detalhes básicos do seu gift card'}
                  {currentStep === 2 && 'Adicione recursos especiais e benefícios'}
                  {currentStep === 3 && 'Configure opções avançadas e privacidade'}
                  {currentStep === 4 && 'Revise todas as informações antes de criar'}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Passo 1: Informações Básicas */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-base font-medium">
                          Título <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="title" 
                          placeholder="Ex: Amazon Gift Card Premium"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="h-12"
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-base font-medium">
                          Descrição <span className="text-red-500">*</span>
                        </Label>
                        <Textarea 
                          id="description" 
                          placeholder="Descreva o gift card e sua utilidade"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="min-h-24"
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="merchant" className="text-base font-medium">
                          Comerciante <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="merchant" 
                          placeholder="Nome da loja ou empresa"
                          value={merchant}
                          onChange={(e) => setMerchant(e.target.value)}
                          className="h-12"
                        />
                        {errors.merchant && <p className="text-sm text-red-500">{errors.merchant}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-base font-medium">
                          Categoria <span className="text-red-500">*</span>
                        </Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="E-commerce">🛒 E-commerce</SelectItem>
                            <SelectItem value="Streaming">📺 Streaming</SelectItem>
                            <SelectItem value="Transporte">🚗 Transporte</SelectItem>
                            <SelectItem value="Viagens">✈️ Viagens</SelectItem>
                            <SelectItem value="Alimentação">🍕 Alimentação</SelectItem>
                            <SelectItem value="Games">🎮 Games</SelectItem>
                            <SelectItem value="Varejo">🏪 Varejo</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="image" className="text-base font-medium">Imagem URL</Label>
                        <Input 
                          id="image" 
                          placeholder="https://exemplo.com/imagem.png"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          className="h-12"
                        />
                        <p className="text-sm text-muted-foreground">
                          URL da imagem que representa o gift card
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-base font-medium">
                          Valor (USD) <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex gap-3">
                          <Input 
                            id="price" 
                            placeholder="50.00"
                            value={priceUsd}
                            onChange={(e) => setPriceUsd(e.target.value)}
                            className="h-12"
                          />
                          <div className="w-32 h-12 py-3 px-4 border rounded-lg text-sm bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center font-medium text-blue-700 dark:text-blue-300">
                            ≈ {calculateEth(priceUsd)} ETH
                          </div>
                        </div>
                        {errors.priceUsd && <p className="text-sm text-red-500">{errors.priceUsd}</p>}
                        <p className="text-sm text-muted-foreground">
                          Valor inicial do gift card
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-base font-medium">
                          Data de Expiração <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          id="expiryDate" 
                          type="date"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="h-12"
                        />
                        {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
                      </div>
                      
                      <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30 dark:border-green-800/60">
                        <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-300 font-medium">
                          💡 A emissão custa menos de 0,5% do valor, muito abaixo dos 4-7% tradicionais!
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                )}
                
                {/* Passo 2: Recursos e Benefícios */}
                {currentStep === 2 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-purple-600" />
                          Recursos Especiais
                        </h3>
                        
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <RefreshCw className="h-5 w-5 text-blue-600" />
                              <div>
                                <Label htmlFor="rechargeable" className="font-medium text-base">Recarregável</Label>
                                <p className="text-sm text-muted-foreground">Permite adicionar valor posteriormente</p>
                              </div>
                            </div>
                            <Switch 
                              id="rechargeable" 
                              checked={isRechargeable}
                              onCheckedChange={setIsRechargeable}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Shield className="h-5 w-5 text-green-600" />
                              <div>
                                <Label htmlFor="privacy" className="font-medium text-base">Privacidade Habilitada</Label>
                                <p className="text-sm text-muted-foreground">Transações com zero-knowledge proofs</p>
                              </div>
                            </div>
                            <Switch 
                              id="privacy" 
                              checked={isPrivacyEnabled}
                              onCheckedChange={setIsPrivacyEnabled}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <RefreshCw className="h-5 w-5 text-orange-600" />
                              <div>
                                <Label htmlFor="autorenewal" className="font-medium text-base">Auto Renovação</Label>
                                <p className="text-sm text-muted-foreground">Renova automaticamente quando expira</p>
                              </div>
                            </div>
                            <Switch 
                              id="autorenewal" 
                              checked={autoRenewal}
                              onCheckedChange={setAutoRenewal}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <BadgePercent className="h-5 w-5 text-green-600" />
                          Benefícios e Recompensas
                        </h3>
                        
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-base font-medium flex items-center gap-2">
                              <BadgePercent className="h-4 w-4" />
                              Desconto: {discount[0]}%
                            </Label>
                            <Slider
                              value={discount}
                              onValueChange={setDiscount}
                              max={50}
                              step={1}
                              className="w-full"
                            />
                            <p className="text-sm text-muted-foreground">
                              Desconto oferecido na compra do gift card
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            <Label className="text-base font-medium flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Cashback: {benefitCashback[0]}%
                            </Label>
                            <Slider
                              value={benefitCashback}
                              onValueChange={setBenefitCashback}
                              max={20}
                              step={0.5}
                              className="w-full"
                            />
                            <p className="text-sm text-muted-foreground">
                              Porcentagem de cashback no uso
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            <Label className="text-base font-medium flex items-center gap-2">
                              <Coins className="h-4 w-4" />
                              Pontos de Recompensa: {benefitPoints[0]}x
                            </Label>
                            <Slider
                              value={benefitPoints}
                              onValueChange={setBenefitPoints}
                              max={10}
                              step={0.5}
                              className="w-full"
                            />
                            <p className="text-sm text-muted-foreground">
                              Multiplicador de pontos de fidelidade
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Passo 3: Configurações Avançadas */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">Configurações Avançadas</h3>
                      <p className="text-muted-foreground">Configure opções especiais para seu NFT Gift Card</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <LockKeyhole className="h-5 w-5 text-purple-600" />
                          Segurança e Privacidade
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Transações Privadas</span>
                            <Badge variant={isPrivacyEnabled ? "default" : "secondary"}>
                              {isPrivacyEnabled ? "Ativado" : "Desativado"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Proteção Anti-Fraude</span>
                            <Badge variant="default">Ativado</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Verificação Dupla</span>
                            <Badge variant="default">Ativado</Badge>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-6">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                          Análise e Métricas
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Tracking de Uso</span>
                            <Badge variant="default">Ativado</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Relatórios Automáticos</span>
                            <Badge variant="default">Ativado</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Alertas de Saldo</span>
                            <Badge variant="default">Ativado</Badge>
                          </div>
                        </div>
                      </Card>
                    </div>
                    
                    <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/60">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <AlertDescription className="text-blue-800 dark:text-blue-300">
                        <strong>Segurança Garantida:</strong> Todas as transações são protegidas por contratos inteligentes auditados e criptografia de ponta.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                
                {/* Passo 4: Revisão e Confirmação */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">Revisão Final</h3>
                      <p className="text-muted-foreground">Confirme todos os detalhes antes de criar seu NFT Gift Card</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <h4 className="font-semibold mb-4">Informações Básicas</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Título:</span>
                            <span className="font-medium">{title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Comerciante:</span>
                            <span className="font-medium">{merchant}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Categoria:</span>
                            <span className="font-medium">{category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Valor:</span>
                            <span className="font-medium">${priceUsd} (≈ {calculateEth(priceUsd)} ETH)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expira em:</span>
                            <span className="font-medium">{expiryDate}</span>
                          </div>
                        </div>
                      </Card>
                      
                      <Card className="p-6">
                        <h4 className="font-semibold mb-4">Recursos e Benefícios</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Recarregável:</span>
                            <Badge variant={isRechargeable ? "default" : "secondary"}>
                              {isRechargeable ? "Sim" : "Não"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Privacidade:</span>
                            <Badge variant={isPrivacyEnabled ? "default" : "secondary"}>
                              {isPrivacyEnabled ? "Ativada" : "Desativada"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Desconto:</span>
                            <span className="font-medium">{discount[0]}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cashback:</span>
                            <span className="font-medium">{benefitCashback[0]}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Pontos:</span>
                            <span className="font-medium">{benefitPoints[0]}x</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                    
                    <Alert className="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800/60">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription className="text-green-800 dark:text-green-300">
                        <strong>Tudo pronto!</strong> Seu NFT Gift Card será criado na blockchain com todas as configurações especificadas.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                {currentStep < 4 ? (
                  <Button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
                  >
                    Próximo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={finishCreation}
                    disabled={isMintingNFT || !isConnected}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isMintingNFT ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Criando NFT...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {isConnected ? 'Criar NFT Gift Card' : 'Conecte sua carteira'}
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Tab: Gerar Troco */}
          <TabsContent value="troco">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <CreditCard className="h-6 w-6" />
                  Gerar Troco como NFT
                </CardTitle>
                <CardDescription className="text-base">
                  Converta o troco de suas compras em NFT Gift Cards reutilizáveis
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="originalBalance" className="text-base font-medium">
                      Saldo Original (USD)
                    </Label>
                    <Input 
                      id="originalBalance" 
                      placeholder="100.00"
                      value={originalBalance}
                      onChange={(e) => {
                        setOriginalBalance(e.target.value);
                        calculateChange();
                      }}
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="usedAmount" className="text-base font-medium">
                      Valor Usado (USD)
                    </Label>
                    <Input 
                      id="usedAmount" 
                      placeholder="75.50"
                      value={usedAmount}
                      onChange={(e) => {
                        setUsedAmount(e.target.value);
                        calculateChange();
                      }}
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Troco Calculado</Label>
                    <div className="h-12 px-4 border rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center font-semibold text-green-700 dark:text-green-300">
                      ${changeAmount}
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/60">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-blue-800 dark:text-blue-300">
                    <strong>Inovação Verde:</strong> Transforme pequenos trocos em valor digital reutilizável, reduzindo desperdícios e criando um ecossistema sustentável.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-center">
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    disabled={parseFloat(changeAmount) <= 0}
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    Gerar NFT de Troco
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab: Para Comerciantes */}
          <TabsContent value="comerciante">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <Landmark className="h-6 w-6" />
                  Soluções para Comerciantes
                </CardTitle>
                <CardDescription className="text-base">
                  Crie programas de fidelidade e gift cards personalizados para seu negócio
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 text-center">
                    <BadgePercent className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                    <h3 className="font-semibold mb-2">Programa de Fidelidade</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Crie pontos e recompensas automáticas para seus clientes
                    </p>
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  </Card>
                  
                  <Card className="p-6 text-center">
                    <Gift className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="font-semibold mb-2">Gift Cards em Massa</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Emita milhares de gift cards com contratos inteligentes
                    </p>
                    <Button variant="outline" size="sm">
                      Criar Lote
                    </Button>
                  </Card>
                  
                  <Card className="p-6 text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <h3 className="font-semibold mb-2">Analytics Avançado</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Monitore vendas, uso e performance em tempo real
                    </p>
                    <Button variant="outline" size="sm">
                      Ver Relatórios
                    </Button>
                  </Card>
                </div>
                
                <Alert className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 dark:from-purple-950/30 dark:to-blue-950/30 dark:border-purple-800/60">
                  <Landmark className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <AlertDescription className="text-purple-800 dark:text-purple-300">
                    <strong>Para B2B:</strong> Oferecemos APIs completas, integração com sistemas existentes e suporte técnico dedicado para empresas.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-center">
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Landmark className="h-4 w-4 mr-2" />
                    Entrar em Contato
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateGiftCard;