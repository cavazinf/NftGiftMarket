import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { SUPPORTED_NETWORKS, switchToNetwork, getNetworkConfig } from '@/lib/networks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Zap, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export function NetworkSelector() {
  const { chainId, isConnected } = useWallet();
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentNetwork = chainId ? getNetworkConfig(chainId) : null;

  const handleNetworkSwitch = async (networkName: string) => {
    const network = SUPPORTED_NETWORKS[networkName];
    if (!network) return;

    setSwitching(true);
    setError(null);

    try {
      await switchToNetwork(network.chainId);
    } catch (error: any) {
      setError(error.message || 'Erro ao trocar de rede');
    } finally {
      setSwitching(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Seleção de Rede
          </CardTitle>
          <CardDescription>
            Conecte sua carteira para selecionar uma rede
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Rede Blockchain
        </CardTitle>
        <CardDescription>
          Escolha a rede onde deseja mintar seus NFT Gift Cards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Network Status */}
        {currentNetwork && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">{currentNetwork.displayName}</span>
                <Badge variant="secondary" className="text-xs">
                  {currentNetwork.testnet ? 'Testnet' : 'Mainnet'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Chain ID: {currentNetwork.chainId}
              </p>
            </div>
            {currentNetwork.blockExplorer && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(currentNetwork.blockExplorer, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Network Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Trocar para:</label>
          <Select onValueChange={handleNetworkSwitch} disabled={switching}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma rede" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SUPPORTED_NETWORKS).map(([key, network]) => (
                <SelectItem 
                  key={key} 
                  value={key}
                  disabled={network.chainId === chainId}
                >
                  <div className="flex items-center gap-2">
                    <span>{network.displayName}</span>
                    <Badge variant="outline" className="text-xs">
                      {network.nativeCurrency.symbol}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Network Details */}
        <div className="grid gap-3">
          {Object.entries(SUPPORTED_NETWORKS).map(([key, network]) => (
            <div
              key={key}
              className={`p-3 border rounded-lg transition-colors ${
                network.chainId === chainId 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{network.displayName}</span>
                    {network.chainId === chainId && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Chain ID: {network.chainId}</span>
                    <span>•</span>
                    <span>{network.nativeCurrency.symbol}</span>
                  </div>
                </div>
                <Badge variant={network.testnet ? "secondary" : "default"}>
                  {network.testnet ? 'Testnet' : 'Mainnet'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Info */}
        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            Para usar Sepolia ou Amoy, você precisa ter tokens de teste na sua carteira.
            Para Sepolia: ETH de teste | Para Amoy: MATIC de teste
          </AlertDescription>
        </Alert>

        {/* Loading State */}
        {switching && (
          <div className="flex items-center justify-center p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm">Trocando de rede...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}