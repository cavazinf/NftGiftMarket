import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  QrCode, Camera, CheckCircle, XCircle, ArrowLeft, 
  Wallet, DollarSign, Clock, Store, CreditCard,
  Scan, AlertTriangle, RefreshCw
} from 'lucide-react';

interface NFTGiftCard {
  id: string;
  title: string;
  merchant: string;
  balanceUsd: number;
  balanceEth: number;
  status: 'active' | 'empty' | 'expired';
  isPrivacyEnabled: boolean;
}

const B2BScanner = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedNFT, setScannedNFT] = useState<NFTGiftCard | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [changeAmount, setChangeAmount] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simular NFT escaneado para demonstração
  const mockScanNFT = () => {
    const mockNFT: NFTGiftCard = {
      id: '0x1a2b3c4d5e6f',
      title: 'Amazon Gift Card Premium',
      merchant: 'Amazon',
      balanceUsd: 50.00,
      balanceEth: 0.025,
      status: 'active',
      isPrivacyEnabled: true
    };
    setScannedNFT(mockNFT);
    setIsScanning(false);
    toast({
      title: 'NFT Escaneado!',
      description: `Gift Card da ${mockNFT.merchant} detectado com sucesso.`
    });
  };

  // Iniciar scanner de QR Code
  const startScanning = async () => {
    setIsScanning(true);
    try {
      // Em produção, aqui seria integrado com uma biblioteca de QR scanner real
      // Por enquanto, simularemos após 2 segundos
      setTimeout(() => {
        mockScanNFT();
      }, 2000);
      
      toast({
        title: 'Scanner ativado',
        description: 'Posicione o QR Code do NFT Gift Card na frente da câmera.'
      });
    } catch (error) {
      setIsScanning(false);
      toast({
        title: 'Erro no scanner',
        description: 'Não foi possível acessar a câmera.',
        variant: 'destructive'
      });
    }
  };

  // Processar transação
  const processTransaction = async () => {
    if (!scannedNFT || !purchaseAmount) return;
    
    const amount = parseFloat(purchaseAmount);
    if (amount > scannedNFT.balanceUsd) {
      toast({
        title: 'Saldo insuficiente',
        description: 'O valor da compra excede o saldo do NFT.',
        variant: 'destructive'
      });
      return;
    }

    setTransactionStatus('processing');
    
    // Simular processamento
    setTimeout(() => {
      const change = scannedNFT.balanceUsd - amount;
      setChangeAmount(change);
      
      if (change === 0) {
        // NFT esgotado
        setScannedNFT({
          ...scannedNFT,
          balanceUsd: 0,
          balanceEth: 0,
          status: 'empty'
        });
      } else {
        // Atualizar saldo
        setScannedNFT({
          ...scannedNFT,
          balanceUsd: change,
          balanceEth: change * 0.0005
        });
      }
      
      setTransactionStatus('success');
      toast({
        title: 'Transação concluída!',
        description: change > 0 
          ? `Compra realizada. Troco de $${change.toFixed(2)} mantido no NFT.`
          : 'Compra realizada. NFT totalmente utilizado.'
      });
    }, 3000);
  };

  // Reset para nova transação
  const resetTransaction = () => {
    setScannedNFT(null);
    setPurchaseAmount('');
    setChangeAmount(0);
    setTransactionStatus('idle');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setLocation('/b2b-dashboard')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Scanner B2B NFT
          </h1>
          <p className="text-lg text-muted-foreground">
            Escaneie QR Codes de NFT Gift Cards para processar pagamentos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <QrCode className="h-6 w-6" />
                Scanner QR Code
              </CardTitle>
              <CardDescription>
                Escaneie o QR Code do NFT Gift Card do cliente
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!isScanning && !scannedNFT && (
                <div className="text-center space-y-4">
                  <div className="w-64 h-64 mx-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
                    <div className="text-center">
                      <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">Clique para ativar o scanner</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={startScanning}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    Iniciar Scanner
                  </Button>
                </div>
              )}

              {isScanning && (
                <div className="text-center space-y-4">
                  <div className="w-64 h-64 mx-auto border-2 border-blue-500 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-950/30 animate-pulse">
                    <div className="text-center">
                      <div className="relative">
                        <QrCode className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                        <div className="absolute inset-0 border-2 border-blue-600 rounded animate-ping opacity-75"></div>
                      </div>
                      <p className="text-blue-600 font-medium">Escaneando...</p>
                    </div>
                  </div>
                  
                  <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/30">
                    <Scan className="h-4 w-4" />
                    <AlertDescription>
                      Posicione o QR Code do NFT Gift Card na área destacada
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {scannedNFT && (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-700 dark:text-green-300">NFT Detectado</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>ID:</span>
                        <span className="font-mono">{scannedNFT.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Título:</span>
                        <span className="font-medium">{scannedNFT.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comerciante:</span>
                        <span className="font-medium">{scannedNFT.merchant}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saldo:</span>
                        <span className="font-semibold">${scannedNFT.balanceUsd.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant={scannedNFT.status === 'active' ? 'default' : 'secondary'}>
                          {scannedNFT.status === 'active' ? 'Ativo' : 
                           scannedNFT.status === 'empty' ? 'Esgotado' : 'Expirado'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={resetTransaction}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Escanear Novo NFT
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transaction Section */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <CreditCard className="h-6 w-6" />
                Processar Pagamento
              </CardTitle>
              <CardDescription>
                Insira o valor da compra e processe o pagamento
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {!scannedNFT ? (
                <div className="text-center py-12">
                  <Store className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">Escaneie um NFT Gift Card primeiro</p>
                </div>
              ) : scannedNFT.status !== 'active' ? (
                <Alert className="bg-red-50 border-red-200 dark:bg-red-950/30">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Este NFT não pode ser usado. Status: {scannedNFT.status === 'empty' ? 'Esgotado' : 'Expirado'}
                  </AlertDescription>
                </Alert>
              ) : transactionStatus === 'success' ? (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-950/30">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Transação concluída com sucesso!</strong>
                    </AlertDescription>
                  </Alert>
                  
                  <div className="p-4 border rounded-lg space-y-2">
                    <h4 className="font-semibold">Resumo da Transação</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Valor da compra:</span>
                        <span className="font-medium">${purchaseAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Troco:</span>
                        <span className="font-medium">${changeAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saldo restante no NFT:</span>
                        <span className="font-medium">${scannedNFT.balanceUsd.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={resetTransaction}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                  >
                    Nova Transação
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor da Compra (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      max={scannedNFT.balanceUsd}
                      step="0.01"
                      className="h-12 text-lg"
                    />
                    <p className="text-sm text-muted-foreground">
                      Saldo disponível: ${scannedNFT.balanceUsd.toFixed(2)}
                    </p>
                  </div>
                  
                  {purchaseAmount && parseFloat(purchaseAmount) > 0 && (
                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30">
                      <h4 className="font-semibold mb-2">Preview da Transação</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Valor da compra:</span>
                          <span>${parseFloat(purchaseAmount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Troco calculado:</span>
                          <span>${(scannedNFT.balanceUsd - parseFloat(purchaseAmount)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    onClick={processTransaction}
                    disabled={!purchaseAmount || parseFloat(purchaseAmount) <= 0 || parseFloat(purchaseAmount) > scannedNFT.balanceUsd || transactionStatus === 'processing'}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {transactionStatus === 'processing' ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Processando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Processar Pagamento
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 dark:from-blue-950/30 dark:to-purple-950/30">
            <Wallet className="h-4 w-4" />
            <AlertDescription>
              <strong>Como funciona:</strong> O cliente apresenta o QR Code do seu NFT Gift Card. Você escaneia, insere o valor da compra e o sistema automaticamente deduz do saldo, mantendo qualquer troco no NFT ou criando um novo NFT de troco se necessário.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default B2BScanner;