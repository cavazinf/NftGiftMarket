import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useNFTContract } from '@/hooks/useNFTContract';
import { useWallet } from '@/hooks/useWallet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Receipt, Store, Wallet, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ethers } from 'ethers';

const MerchantPayment = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { redeemGiftCard, getUserGiftCards, getGiftCard, isLoading } = useNFTContract();
  const { walletAddress, isConnected } = useWallet();
  
  const [merchantName, setMerchantName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedTokenId, setSelectedTokenId] = useState('');
  const [userGiftCards, setUserGiftCards] = useState<string[]>([]);
  const [cardDetails, setCardDetails] = useState<{[tokenId: string]: any}>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  
  // Carregar os cartões do usuário
  useEffect(() => {
    if (isConnected && walletAddress) {
      loadUserGiftCards();
    }
  }, [isConnected, walletAddress]);
  
  const loadUserGiftCards = async () => {
    try {
      const tokenIds = await getUserGiftCards(walletAddress!);
      setUserGiftCards(tokenIds);
      
      // Carregar detalhes de cada cartão
      const details: {[tokenId: string]: any} = {};
      for (const tokenId of tokenIds) {
        const cardInfo = await getGiftCard(tokenId);
        if (cardInfo) {
          details[tokenId] = cardInfo;
        }
      }
      setCardDetails(details);
    } catch (error) {
      console.error("Erro ao carregar cartões do usuário:", error);
    }
  };
  
  // Realizar pagamento em estabelecimento comercial
  const processMerchantPayment = async () => {
    if (!isConnected) {
      toast({
        title: 'Carteira não conectada',
        description: 'Conecte sua carteira para usar o Gift Card',
        variant: 'destructive'
      });
      return;
    }
    
    if (!selectedTokenId || !paymentAmount || !merchantName) {
      toast({
        title: 'Informações incompletas',
        description: 'Por favor, selecione um cartão, informe o valor e o nome do estabelecimento',
        variant: 'destructive'
      });
      return;
    }
    
    const cardInfo = cardDetails[selectedTokenId];
    if (!cardInfo) {
      toast({
        title: 'Cartão não encontrado',
        description: 'Não foi possível obter os detalhes do cartão selecionado',
        variant: 'destructive'
      });
      return;
    }
    
    // Verificar se tem saldo suficiente
    const balanceInEth = parseFloat(ethers.formatEther(cardInfo.balanceInWei));
    const amountInEth = parseFloat(paymentAmount);
    
    if (amountInEth > balanceInEth) {
      toast({
        title: 'Saldo insuficiente',
        description: `Seu cartão tem ${balanceInEth.toFixed(6)} ETH, mas você está tentando pagar ${amountInEth.toFixed(6)} ETH`,
        variant: 'destructive'
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      // Realizar o pagamento
      const result = await redeemGiftCard(selectedTokenId, amountInEth);
      
      // Simulação de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsPaymentComplete(true);
      
      toast({
        title: 'Pagamento realizado com sucesso!',
        description: `Pagamento de ${amountInEth} ETH feito para ${merchantName}`,
      });
      
      // Atualizar os cartões do usuário
      await loadUserGiftCards();
    } catch (error: any) {
      toast({
        title: 'Erro ao processar pagamento',
        description: error.message || 'Houve um erro ao processar o pagamento',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Lista de estabelecimentos de exemplo
  const merchantOptions = [
    { name: 'Café Expresso', category: 'Alimentação' },
    { name: 'Livraria Mundial', category: 'Varejo' },
    { name: 'Supermercado Dia', category: 'Varejo' },
    { name: 'Farmácia Saúde', category: 'Saúde' },
    { name: 'Cinema Star', category: 'Entretenimento' },
    { name: 'Posto Avenida', category: 'Combustível' },
    { name: 'Restaurante Sabor', category: 'Alimentação' },
    { name: 'Viagens Mundo', category: 'Turismo' }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation('/marketplace')} className="gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Marketplace
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Pagar com NFT Gift Card
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use seu NFT Gift Card para pagar em estabelecimentos comerciais
          </p>
        </div>
        
        {isPaymentComplete ? (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm max-w-md mx-auto">
            <CardContent className="pt-6 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Pagamento Concluído!</h2>
              <p className="text-center text-muted-foreground mb-6">
                Seu pagamento para {merchantName} foi realizado com sucesso.
              </p>
              
              <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Valor</span>
                  <span className="font-semibold">{paymentAmount} ETH</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Comércio</span>
                  <span className="font-semibold">{merchantName}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Gift Card ID</span>
                  <span className="font-semibold">#{selectedTokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data</span>
                  <span className="font-semibold">{new Date().toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={() => setLocation('/marketplace')}>
                  Ir para o Marketplace
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsPaymentComplete(false);
                  setMerchantName('');
                  setPaymentAmount('');
                  setSelectedTokenId('');
                }}>
                  Novo Pagamento
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Pagamento em Estabelecimento</CardTitle>
              <CardDescription>Use seu NFT Gift Card para pagar em comércios físicos ou virtuais</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="merchant">Estabelecimento</Label>
                <Select value={merchantName} onValueChange={setMerchantName}>
                  <SelectTrigger id="merchant">
                    <SelectValue placeholder="Selecione o estabelecimento" />
                  </SelectTrigger>
                  <SelectContent>
                    {merchantOptions.map((merchant) => (
                      <SelectItem key={merchant.name} value={merchant.name}>
                        {merchant.name} ({merchant.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Valor a Pagar (ETH)</Label>
                <Input
                  id="amount"
                  placeholder="Ex: 0.05"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Selecione seu NFT Gift Card</Label>
                {userGiftCards.length === 0 ? (
                  <div className="p-4 text-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">Você não possui nenhum NFT Gift Card</p>
                    <Button size="sm" variant="link" onClick={() => setLocation('/marketplace')}>
                      Ir para o Marketplace
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {userGiftCards.map((tokenId) => {
                      const card = cardDetails[tokenId];
                      if (!card) return null;
                      
                      const balanceInEth = parseFloat(ethers.formatEther(card.balanceInWei || 0));
                      const isSelected = selectedTokenId === tokenId;
                      
                      return (
                        <div
                          key={tokenId}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30' 
                              : 'hover:border-blue-200 dark:hover:border-blue-800'
                          }`}
                          onClick={() => setSelectedTokenId(tokenId)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-base">{card.merchantName}</h3>
                              <p className="text-sm text-muted-foreground">{card.category} • ID #{tokenId}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{balanceInEth.toFixed(6)} ETH</p>
                              <p className="text-xs text-muted-foreground">Saldo disponível</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={processMerchantPayment} 
                disabled={isProcessing || userGiftCards.length === 0 || !selectedTokenId || !paymentAmount || !merchantName} 
                className="w-full gap-2"
              >
                {isProcessing ? (
                  <>Processando pagamento...</>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pagar com NFT Gift Card
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MerchantPayment;