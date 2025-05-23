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
import { 
  Gift, Shield, Wallet, Sparkles, CreditCard, 
  ArrowLeft, Upload, ArrowRight, Check, AlertCircle, 
  RefreshCw, LockKeyhole, BadgePercent, Landmark
} from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const CreateGiftCard = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentTab, setCurrentTab] = useState('novo');
  
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
  const [discount, setDiscount] = useState(0);
  const [benefitCashback, setBenefitCashback] = useState(0);
  const [benefitPoints, setBenefitPoints] = useState(0);
  const [autoRenewal, setAutoRenewal] = useState(false);
  const [inactivityPeriod, setInactivityPeriod] = useState(180); // Dias para desativar por inatividade
  
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
  
  // Finalizar criação
  const finishCreation = () => {
    toast({
      title: 'Gift Card criado com sucesso!',
      description: 'Seu NFT Gift Card foi criado e está pronto para uso.'
    });
    
    setTimeout(() => {
      setLocation('/marketplace');
    }, 1500);
  };
  
  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setLocation('/marketplace')} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Marketplace
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Criar NFT Gift Card</h1>
      <p className="text-muted-foreground mb-8">Transforme créditos em NFT Gift Cards com baixo custo de emissão e recursos avançados.</p>
      
      <Tabs defaultValue="novo" value={currentTab} onValueChange={setCurrentTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="novo">
            <Gift className="mr-2 h-4 w-4" />
            Novo Gift Card
          </TabsTrigger>
          <TabsTrigger value="troco">
            <CreditCard className="mr-2 h-4 w-4" />
            Gerar Troco
          </TabsTrigger>
          <TabsTrigger value="comerciante">
            <Landmark className="mr-2 h-4 w-4" />
            Para Comerciantes
          </TabsTrigger>
        </TabsList>
        
        {/* Tab: Novo Gift Card */}
        <TabsContent value="novo">
          <Card>
            {/* Cabeçalho com passos */}
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    1
                  </div>
                  <div className={`h-1 w-10 ${currentStep > 1 ? 'bg-primary' : 'bg-muted'}`}></div>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    2
                  </div>
                  <div className={`h-1 w-10 ${currentStep > 2 ? 'bg-primary' : 'bg-muted'}`}></div>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    3
                  </div>
                  <div className={`h-1 w-10 ${currentStep > 3 ? 'bg-primary' : 'bg-muted'}`}></div>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    4
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Passo {currentStep} de 4
                </div>
              </div>
              <CardTitle>
                {currentStep === 1 && 'Informações Básicas'}
                {currentStep === 2 && 'Recursos e Benefícios'}
                {currentStep === 3 && 'Configurações Avançadas'}
                {currentStep === 4 && 'Revisão e Confirmação'}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && 'Defina os detalhes básicos do seu gift card'}
                {currentStep === 2 && 'Adicione recursos especiais e benefícios'}
                {currentStep === 3 && 'Configure opções avançadas e privacidade'}
                {currentStep === 4 && 'Revise todas as informações antes de criar'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Passo 1: Informações Básicas */}
              {currentStep === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título <span className="text-destructive">*</span></Label>
                        <Input 
                          id="title" 
                          placeholder="Ex: Amazon Gift Card Premium"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição <span className="text-destructive">*</span></Label>
                        <Textarea 
                          id="description" 
                          placeholder="Descreva o gift card e sua utilidade"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="merchant">Comerciante <span className="text-destructive">*</span></Label>
                        <Input 
                          id="merchant" 
                          placeholder="Nome da loja ou empresa"
                          value={merchant}
                          onChange={(e) => setMerchant(e.target.value)}
                        />
                        {errors.merchant && <p className="text-sm text-destructive">{errors.merchant}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria <span className="text-destructive">*</span></Label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="E-commerce">E-commerce</SelectItem>
                            <SelectItem value="Streaming">Streaming</SelectItem>
                            <SelectItem value="Transporte">Transporte</SelectItem>
                            <SelectItem value="Viagens">Viagens</SelectItem>
                            <SelectItem value="Alimentação">Alimentação</SelectItem>
                            <SelectItem value="Games">Games</SelectItem>
                            <SelectItem value="Varejo">Varejo</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="image">Imagem URL</Label>
                        <Input 
                          id="image" 
                          placeholder="https://exemplo.com/imagem.png"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                        />
                        <div className="text-xs text-muted-foreground">
                          URL da imagem que representa o gift card
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="price">Valor (USD) <span className="text-destructive">*</span></Label>
                        <div className="flex gap-2">
                          <Input 
                            id="price" 
                            placeholder="50.00"
                            value={priceUsd}
                            onChange={(e) => setPriceUsd(e.target.value)}
                          />
                          <div className="w-28 py-2 px-3 border rounded-md text-xs bg-muted flex items-center justify-center">
                            ≈ {calculateEth(priceUsd)} ETH
                          </div>
                        </div>
                        {errors.priceUsd && <p className="text-sm text-destructive">{errors.priceUsd}</p>}
                        <div className="text-xs text-muted-foreground">
                          Valor inicial do gift card
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Data de Expiração <span className="text-destructive">*</span></Label>
                        <Input 
                          id="expiryDate" 
                          type="date"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                        />
                        {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate}</p>}
                      </div>
                      
                      <div className="pt-4">
                        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/60">
                          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <AlertDescription className="text-amber-800 dark:text-amber-300">
                            A emissão custa menos de 0,5% do valor, muito abaixo dos 4-7% tradicionais.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Passo 2: Recursos e Benefícios */}
              {currentStep === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Recursos Especiais</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <RefreshCw className="h-4 w-4 text-primary" />
                              <Label htmlFor="rechargeable" className="font-medium">Recarregável</Label>
                            </div>
                            <Switch 
                              id="rechargeable" 
                              checked={isRechargeable}
                              onCheckedChange={setIsRechargeable}
                            />
                          </div>
                          
                          <div className="pl-6 text-sm text-muted-foreground">
                            Permite adicionar mais saldo ao gift card no futuro e receber notificações antes da expiração.
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <LockKeyhole className="h-4 w-4 text-primary" />
                              <Label htmlFor="privacy" className="font-medium">Privacidade ZK</Label>
                            </div>
                            <Switch 
                              id="privacy" 
                              checked={isPrivacyEnabled}
                              onCheckedChange={setIsPrivacyEnabled}
                            />
                          </div>
                          
                          <div className="pl-6 text-sm text-muted-foreground">
                            Permite resgates privados com Zero-Knowledge Proofs, provando apenas que possui saldo suficiente.
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-primary" />
                              <Label htmlFor="autoRenewal" className="font-medium">Auto-renovação</Label>
                            </div>
                            <Switch 
                              id="autoRenewal" 
                              checked={autoRenewal}
                              onCheckedChange={setAutoRenewal}
                            />
                          </div>
                          
                          <div className="pl-6 text-sm text-muted-foreground">
                            Renova automaticamente o gift card antes da expiração se houver saldo disponível.
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium mb-4">Benefícios</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="discount" className="flex items-center">
                              <BadgePercent className="h-4 w-4 mr-2 text-primary" />
                              Desconto aplicado
                            </Label>
                            <span className="text-sm font-medium">{discount}%</span>
                          </div>
                          <Slider
                            id="discount"
                            value={[discount]}
                            min={0}
                            max={50}
                            step={1}
                            onValueChange={(value) => setDiscount(value[0])}
                          />
                          <div className="text-xs text-muted-foreground">
                            Desconto a ser aplicado no preço do gift card
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="cashback" className="flex items-center">
                              <Wallet className="h-4 w-4 mr-2 text-primary" />
                              Cashback (%)
                            </Label>
                            <span className="text-sm font-medium">{benefitCashback}%</span>
                          </div>
                          <Slider
                            id="cashback"
                            value={[benefitCashback]}
                            min={0}
                            max={10}
                            step={0.5}
                            onValueChange={(value) => setBenefitCashback(value[0])}
                          />
                          <div className="text-xs text-muted-foreground">
                            Percentual de cashback no uso do gift card
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="points" className="flex items-center">
                              <Sparkles className="h-4 w-4 mr-2 text-primary" />
                              Pontos de recompensa
                            </Label>
                            <span className="text-sm font-medium">{benefitPoints}</span>
                          </div>
                          <Slider
                            id="points"
                            value={[benefitPoints]}
                            min={0}
                            max={2000}
                            step={50}
                            onValueChange={(value) => setBenefitPoints(value[0])}
                          />
                          <div className="text-xs text-muted-foreground">
                            Pontos de fidelidade para uso futuro
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <Label>Recursos Incluídos</Label>
                        <div className="space-y-2">
                          {category === 'Streaming' && (
                            <>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="feature-4k"
                                  checked={features.includes('4K Ultra HD')}
                                  onCheckedChange={(checked) => 
                                    handleFeatureChange('4K Ultra HD', checked as boolean)
                                  }
                                />
                                <label htmlFor="feature-4k">4K Ultra HD</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="feature-multi"
                                  checked={features.includes('Multi-dispositivos')}
                                  onCheckedChange={(checked) => 
                                    handleFeatureChange('Multi-dispositivos', checked as boolean)
                                  }
                                />
                                <label htmlFor="feature-multi">Multi-dispositivos</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="feature-offline"
                                  checked={features.includes('Downloads Offline')}
                                  onCheckedChange={(checked) => 
                                    handleFeatureChange('Downloads Offline', checked as boolean)
                                  }
                                />
                                <label htmlFor="feature-offline">Downloads Offline</label>
                              </div>
                            </>
                          )}
                          
                          {category === 'E-commerce' && (
                            <>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="feature-frete"
                                  checked={features.includes('Frete Grátis')}
                                  onCheckedChange={(checked) => 
                                    handleFeatureChange('Frete Grátis', checked as boolean)
                                  }
                                />
                                <label htmlFor="feature-frete">Frete Grátis</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="feature-prime"
                                  checked={features.includes('Acesso Premium')}
                                  onCheckedChange={(checked) => 
                                    handleFeatureChange('Acesso Premium', checked as boolean)
                                  }
                                />
                                <label htmlFor="feature-prime">Acesso Premium</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox 
                                  id="feature-garantia"
                                  checked={features.includes('Garantia Estendida')}
                                  onCheckedChange={(checked) => 
                                    handleFeatureChange('Garantia Estendida', checked as boolean)
                                  }
                                />
                                <label htmlFor="feature-garantia">Garantia Estendida</label>
                              </div>
                            </>
                          )}
                          
                          {!['Streaming', 'E-commerce'].includes(category || '') && (
                            <div className="text-sm text-muted-foreground py-2">
                              Selecione uma categoria para ver os recursos disponíveis
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Passo 3: Configurações Avançadas */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium mb-4">Opções de Privacidade</h3>
                        
                        {isPrivacyEnabled ? (
                          <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
                            <div className="flex items-center gap-3 mb-3">
                              <Shield className="h-5 w-5 text-primary" />
                              <h4 className="font-medium">Proteção ZK-Proof Ativada</h4>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              Este gift card utilizará Zero-Knowledge Proofs para preservar a privacidade. O usuário poderá:
                            </p>
                            
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>Provar que possui saldo suficiente sem revelar o valor exato</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>Fazer compras sem revelar sua identidade</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>Transações com verificação on-chain mas dados privados</span>
                              </li>
                            </ul>
                          </div>
                        ) : (
                          <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
                            <div className="flex items-center gap-3 mb-3">
                              <AlertCircle className="h-5 w-5 text-amber-500" />
                              <h4 className="font-medium">Proteção ZK-Proof Desativada</h4>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              As transações serão públicas na blockchain. Recomendamos ativar a proteção ZK para maior privacidade.
                            </p>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setIsPrivacyEnabled(true)}
                              className="mt-2"
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Ativar Proteção
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium mb-4">Liquidação e Expiração</h3>
                        
                        <div className="space-y-2">
                          <Label>Liquidação para Comerciante</Label>
                          <RadioGroup defaultValue="stablecoin">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="stablecoin" id="stablecoin" />
                              <Label htmlFor="stablecoin">Stablecoin (USDC)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="eth" id="eth" disabled />
                              <Label htmlFor="eth" className="text-muted-foreground">Ethereum (ETH)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="fiat" id="fiat" disabled />
                              <Label htmlFor="fiat" className="text-muted-foreground">Fiat (USD/BRL)</Label>
                            </div>
                          </RadioGroup>
                          <div className="text-xs text-muted-foreground">
                            Método de liquidação para o comerciante
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="inactivityPeriod" className="flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                              Período de inatividade (dias)
                            </Label>
                            <span className="text-sm font-medium">{inactivityPeriod} dias</span>
                          </div>
                          <Slider
                            id="inactivityPeriod"
                            value={[inactivityPeriod]}
                            min={30}
                            max={365}
                            step={30}
                            onValueChange={(value) => setInactivityPeriod(value[0])}
                          />
                          <div className="text-xs text-muted-foreground">
                            O gift card será desativado após este período de inatividade
                          </div>
                        </div>
                        
                        <Alert className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/60">
                          <RefreshCw className="h-4 w-4 text-blue-500" />
                          <AlertDescription className="text-blue-700 dark:text-blue-300">
                            Saldo não utilizado poderá ser recuperado ou transferido para um novo gift card.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4 bg-muted/30">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-primary" />
                        Diferenciais técnicos
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• NFT padrão ERC-6551 com histórico dinâmico</li>
                        <li>• ZK Proofs para preservar privacidade</li>
                        <li>• Liquidação com USDC via Polygon ou Base L2</li>
                        <li>• Emissão e uso on-chain com taxas mínimas</li>
                        <li>• Notificações inteligentes para evitar expiração</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
              
              {/* Passo 4: Revisão e Confirmação */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Resumo do Gift Card</h3>
                        
                        <div className="rounded-lg border overflow-hidden">
                          <div className="h-40 bg-muted flex items-center justify-center">
                            {image ? (
                              <img src={image} alt={title} className="h-full w-full object-cover" />
                            ) : (
                              <Gift className="h-16 w-16 text-muted-foreground/40" />
                            )}
                          </div>
                          
                          <div className="p-4 space-y-3">
                            <div>
                              <h4 className="font-bold text-xl">{title || 'Título do Gift Card'}</h4>
                              <p className="text-sm text-muted-foreground">{merchant || 'Nome do Comerciante'}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="py-1 px-2 rounded-full bg-muted text-xs">
                                {category || 'Categoria'}
                              </div>
                              {discount > 0 && (
                                <div className="py-1 px-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">
                                  {discount}% OFF
                                </div>
                              )}
                              {isRechargeable && (
                                <div className="py-1 px-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs">
                                  Recarregável
                                </div>
                              )}
                              {isPrivacyEnabled && (
                                <div className="py-1 px-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs">
                                  Privacidade ZK
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-between pt-2">
                              <div>
                                <div className="text-xs text-muted-foreground">Valor</div>
                                <div className="font-bold">${priceUsd || '0.00'}</div>
                                <div className="text-xs text-muted-foreground">{calculateEth(priceUsd)} ETH</div>
                              </div>
                              
                              <div className="text-right">
                                <div className="text-xs text-muted-foreground">Expiração</div>
                                <div className="font-medium">
                                  {expiryDate ? new Date(expiryDate).toLocaleDateString() : 'Não definido'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium mb-4">Detalhes</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Descrição</div>
                            <div>{description || 'Sem descrição fornecida'}</div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <div className="text-sm text-muted-foreground">Recursos</div>
                            <div className="mt-1">
                              {features.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {features.map((feature, index) => (
                                    <div key={index} className="flex items-center bg-muted px-2 py-1 rounded-md text-xs">
                                      <Check className="h-3 w-3 mr-1 text-green-500" />
                                      {feature}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">Nenhum recurso adicional</span>
                              )}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <div className="text-sm text-muted-foreground">Benefícios</div>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              {benefitCashback > 0 && (
                                <div className="flex items-center text-sm">
                                  <Wallet className="h-4 w-4 mr-1 text-primary" />
                                  Cashback: {benefitCashback}%
                                </div>
                              )}
                              {benefitPoints > 0 && (
                                <div className="flex items-center text-sm">
                                  <Sparkles className="h-4 w-4 mr-1 text-primary" />
                                  Pontos: {benefitPoints}
                                </div>
                              )}
                              {autoRenewal && (
                                <div className="flex items-center text-sm">
                                  <RefreshCw className="h-4 w-4 mr-1 text-primary" />
                                  Auto-renovação
                                </div>
                              )}
                              {!benefitCashback && !benefitPoints && !autoRenewal && (
                                <span className="text-muted-foreground text-sm">Nenhum benefício adicional</span>
                              )}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <div className="text-sm text-muted-foreground">Detalhes técnicos</div>
                            <div className="space-y-1 mt-1">
                              <div className="flex justify-between text-sm">
                                <span>Padrão NFT:</span>
                                <span className="font-medium">ERC-6551</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Rede:</span>
                                <span className="font-medium">Polygon</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Custo de emissão:</span>
                                <span className="font-medium text-green-600">
                                  {(parseFloat(priceUsd || '0') * 0.005).toFixed(2)} USD (~0.5%)
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Inatividade:</span>
                                <span className="font-medium">{inactivityPeriod} dias</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Alert className="bg-primary/5 border-primary/20">
                      <Check className="h-4 w-4 text-primary" />
                      <AlertDescription>
                        Este NFT Gift Card terá emissão on-chain, com baixo custo e todas as vantagens da tecnologia blockchain.
                      </AlertDescription>
                    </Alert>
                  </div>
                </>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between pt-6">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 4 ? (
                <Button onClick={nextStep}>
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={finishCreation}>
                  Criar Gift Card
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tab: Gerar Troco */}
        <TabsContent value="troco">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Gift Card de Troco</CardTitle>
              <CardDescription>
                Crie um novo gift card com o saldo remanescente após um uso parcial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="originalBalance">Saldo Original (USD)</Label>
                    <Input 
                      id="originalBalance" 
                      placeholder="100.00"
                      value={originalBalance}
                      onChange={(e) => {
                        setOriginalBalance(e.target.value);
                        calculateChange();
                      }}
                    />
                    <div className="text-xs text-muted-foreground">
                      Valor total do gift card original
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="usedAmount">Valor Utilizado (USD)</Label>
                    <Input 
                      id="usedAmount" 
                      placeholder="70.00"
                      value={usedAmount}
                      onChange={(e) => {
                        setUsedAmount(e.target.value);
                        calculateChange();
                      }}
                    />
                    <div className="text-xs text-muted-foreground">
                      Quanto foi gasto do gift card
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria do Gift Card Original</Label>
                    <Select defaultValue="E-commerce">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Streaming">Streaming</SelectItem>
                        <SelectItem value="Transporte">Transporte</SelectItem>
                        <SelectItem value="Viagens">Viagens</SelectItem>
                        <SelectItem value="Alimentação">Alimentação</SelectItem>
                        <SelectItem value="Games">Games</SelectItem>
                        <SelectItem value="Varejo">Varejo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="rounded-lg p-6 border bg-muted/30">
                    <h3 className="text-lg font-medium mb-4">Troco Calculado</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Saldo Original:</span>
                        <span className="font-medium">${parseFloat(originalBalance || '0').toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Valor Utilizado:</span>
                        <span className="font-medium">${parseFloat(usedAmount || '0').toFixed(2)}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Valor do Troco:</span>
                        <span className="text-xl font-bold">${changeAmount}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Equivalente em ETH:</span>
                        <span>{calculateEth(changeAmount)} ETH</span>
                      </div>
                    </div>
                    
                    {parseFloat(changeAmount) <= 0 && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          O valor utilizado não pode ser maior que o saldo original.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {parseFloat(changeAmount) > 0 && parseFloat(changeAmount) < 5 && (
                      <Alert className="mt-4 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/60">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <AlertDescription className="text-amber-700 dark:text-amber-400">
                          Valores de troco abaixo de $5 têm uma taxa adicional de emissão.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full" 
                    disabled={parseFloat(changeAmount) <= 0}
                    onClick={() => {
                      toast({
                        title: "Troco gerado com sucesso!",
                        description: `Novo gift card no valor de $${changeAmount} criado.`
                      });
                      
                      setOriginalBalance('');
                      setUsedAmount('');
                      setChangeAmount('0.00');
                    }}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Gerar Gift Card de Troco
                  </Button>
                </div>
              </div>
              
              <Alert>
                <RefreshCw className="h-4 w-4" />
                <AlertDescription>
                  O troco será gerado como um novo NFT Gift Card com as mesmas características do original.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab: Para Comerciantes */}
        <TabsContent value="comerciante">
          <Card>
            <CardHeader>
              <CardTitle>Portal do Comerciante</CardTitle>
              <CardDescription>
                Crie e emita seus próprios NFT Gift Cards para sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-8 space-y-6">
                  <div className="rounded-lg border p-6">
                    <h3 className="text-xl font-medium mb-2">Benefícios para Comerciantes</h3>
                    <p className="text-muted-foreground mb-4">
                      Emita gift cards com custo muito menor e vantagens exclusivas
                    </p>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex gap-3">
                        <div className="rounded-full p-2 bg-primary/10">
                          <Landmark className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Emissão ultra-barata</h4>
                          <p className="text-sm text-muted-foreground">
                            Custo menor que 0,5% vs. 4-7% dos tradicionais
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="rounded-full p-2 bg-primary/10">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Zero fraudes</h4>
                          <p className="text-sm text-muted-foreground">
                            Eliminação de duplicações e falsificações
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="rounded-full p-2 bg-primary/10">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Liquidação instantânea</h4>
                          <p className="text-sm text-muted-foreground">
                            Receba stablecoins imediatamente ao ser utilizado
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="rounded-full p-2 bg-primary/10">
                          <BadgePercent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Fidelização avançada</h4>
                          <p className="text-sm text-muted-foreground">
                            Crie programas de cashback e recompensas
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Diferenciais Técnicos</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• NFT padrão ERC-6551 com histórico dinâmico</li>
                        <li>• ZK Proofs para preservar privacidade (ZKP ≥ X)</li>
                        <li>• Liquidação com USDC/BRLx via L2 (Polygon ou Base)</li>
                        <li>• Infra escalável com emissão e uso on-chain</li>
                        <li>• Marketplace opcional para revenda</li>
                      </ul>
                    </div>
                  </div>
                  
                  <Alert className="bg-primary/5 border-primary/20">
                    <Check className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      Em 2023, o mercado de gift cards alcançou US$ 6,2 bilhões (R$ 30 bilhões) com projeção de US$ 9,6 bilhões em 2027.
                    </AlertDescription>
                  </Alert>
                </div>
                
                <div className="md:col-span-4 space-y-6">
                  <div className="rounded-lg border p-6 bg-muted/30">
                    <h3 className="font-medium mb-4">Comece Agora</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="merchantName">Nome da Empresa</Label>
                        <Input id="merchantName" placeholder="Ex: Minha Loja" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="merchantEmail">Email Comercial</Label>
                        <Input id="merchantEmail" type="email" placeholder="contato@empresa.com" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="merchantCategory">Categoria</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="e-commerce">E-commerce</SelectItem>
                            <SelectItem value="restaurante">Restaurante</SelectItem>
                            <SelectItem value="varejo">Varejo</SelectItem>
                            <SelectItem value="servicos">Serviços</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-6" onClick={() => {
                      toast({
                        title: "Solicitação recebida!",
                        description: "Em breve entraremos em contato para continuar o cadastro."
                      });
                    }}>
                      <Landmark className="mr-2 h-4 w-4" />
                      Tornar-se Merchant
                    </Button>
                    
                    <div className="flex items-center justify-center mt-6 border-t pt-4">
                      <p className="text-xs text-muted-foreground text-center">
                        Já tem cadastro? <a href="#" className="text-primary hover:underline">Faça login</a>
                      </p>
                    </div>
                  </div>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <h3 className="font-medium">Transforme a experiência</h3>
                      </div>
                      
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Elimina o desperdício (breakage)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Reduz fraudes e intermediários</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>UX fluida: sem código, sem fricção</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Merchants recebem rápido e com controle</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Ideal para fidelização e gamificação</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateGiftCard;