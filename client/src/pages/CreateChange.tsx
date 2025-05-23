import { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { useNFTContract } from '@/hooks/useNFTContract';
import { useWallet } from '@/hooks/useWallet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calculator, CreditCard, DollarSign, Receipt } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ethers } from 'ethers';

const CreateChange = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { getGiftCard, gerarTroco, isLoading } = useNFTContract();
  const { walletAddress, isConnected } = useWallet();
  
  const [tokenId, setTokenId] = useState('');
  const [changeAmount, setChangeAmount] = useState('');
  const [loadingCardInfo, setLoadingCardInfo] = useState(false);
  const [cardInfo, setCardInfo] = useState<any>(null);
  
  // Carregar informações do cartão
  const loadCardInfo = async () => {
    if (!tokenId) {
      toast({
        title: 'Token ID necessário',
        description: 'Por favor, informe o ID do Gift Card',
        variant: 'destructive'
      });
      return;
    }
    
    setLoadingCardInfo(true);
    try {
      const info = await getGiftCard(tokenId);
      setCardInfo(info);
      
      if (!info) {
        toast({
          title: 'Cartão não encontrado',
          description: 'Não foi possível encontrar um Gift Card com este ID',
          variant: 'destructive'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar cartão',
        description: error.message || 'Houve um erro ao buscar as informações do cartão',
        variant: 'destructive'
      });
    } finally {
      setLoadingCardInfo(false);
    }
  };
  
  // Gerar troco
  const generateChange = async () => {
    if (!isConnected) {
      toast({
        title: 'Carteira não conectada',
        description: 'Conecte sua carteira para gerar o troco',
        variant: 'destructive'
      });
      return;
    }
    
    if (!tokenId || !changeAmount) {
      toast({
        title: 'Informações incompletas',
        description: 'Por favor, informe o ID do cartão e o valor do troco',
        variant: 'destructive'
      });
      return;
    }
    
    // Verificar se tem saldo suficiente
    if (cardInfo && parseFloat(changeAmount) > parseFloat(ethers.formatEther(cardInfo.balanceInWei || 0))) {
      toast({
        title: 'Saldo insuficiente',
        description: 'O valor do troco não pode ser maior que o saldo disponível no cartão',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Converter o valor para wei
      const amountInEth = parseFloat(changeAmount);
      const result = await gerarTroco(tokenId, amountInEth);
      
      toast({
        title: 'Troco gerado com sucesso!',
        description: `Um novo Gift Card foi criado com o valor de ${changeAmount} ETH`,
      });
      
      // Recarregar informações do cartão
      await loadCardInfo();
    } catch (error: any) {
      toast({
        title: 'Erro ao gerar troco',
        description: error.message || 'Houve um erro ao gerar o troco',
        variant: 'destructive'
      });
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
            Gerar Troco com Gift Card
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crie um novo cartão com o valor de troco de uma transação
          </p>
        </div>
        
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Geração de Troco</CardTitle>
            <CardDescription>Crie um novo Gift Card com o troco de uma transação</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="tokenId">ID do Gift Card Original</Label>
                <Input 
                  id="tokenId" 
                  placeholder="Ex: 1" 
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                />
              </div>
              <Button onClick={loadCardInfo} disabled={loadingCardInfo}>
                {loadingCardInfo ? 'Carregando...' : 'Buscar Cartão'}
              </Button>
            </div>
            
            {cardInfo && (
              <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4 mt-4">
                <h3 className="font-semibold text-lg">{cardInfo.merchantName}</h3>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <p>{cardInfo.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p>{ethers.formatEther(cardInfo.valueInWei || 0)} ETH</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo Disponível</p>
                    <p className="text-green-600 dark:text-green-400 font-semibold">
                      {ethers.formatEther(cardInfo.balanceInWei || 0)} ETH
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Recarregável</p>
                    <p>{cardInfo.isRechargeable ? 'Sim' : 'Não'}</p>
                  </div>
                </div>
              </div>
            )}
            
            <Separator />
            
            <div>
              <Label htmlFor="changeAmount">Valor do Troco (ETH)</Label>
              <Input 
                id="changeAmount" 
                placeholder="Ex: 0.05" 
                value={changeAmount}
                onChange={(e) => setChangeAmount(e.target.value)}
                disabled={!cardInfo}
              />
              <p className="text-sm text-muted-foreground mt-1">
                O valor será deduzido do cartão original e um novo cartão será criado com este valor.
              </p>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={generateChange} 
              disabled={isLoading || !cardInfo} 
              className="w-full gap-2"
            >
              <Receipt className="h-4 w-4" />
              {isLoading ? 'Processando...' : 'Gerar Cartão de Troco'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateChange;