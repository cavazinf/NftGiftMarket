import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Droplets, Info, Zap } from 'lucide-react';

export function TestnetInfo() {
  const testnetResources = [
    {
      network: 'Polygon Amoy',
      symbol: 'MATIC',
      faucet: 'https://faucet.polygon.technology/',
      explorer: 'https://amoy.polygonscan.com/',
      chainId: 80002,
      description: 'Testnet da Polygon para desenvolvimento'
    },
    {
      network: 'Ethereum Sepolia',
      symbol: 'ETH',
      faucet: 'https://sepoliafaucet.com/',
      explorer: 'https://sepolia.etherscan.io/',
      chainId: 11155111,
      description: 'Testnet oficial do Ethereum'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          Tokens de Teste
        </CardTitle>
        <CardDescription>
          Obtenha tokens gratuitos para testar a mintagem de NFT Gift Cards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Para mintar NFT Gift Cards nas redes de teste, você precisa de tokens nativos para pagar as taxas de gas.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          {testnetResources.map((resource) => (
            <div key={resource.chainId} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{resource.network}</h4>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                </div>
                <Badge variant="outline">{resource.symbol}</Badge>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(resource.faucet, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Droplets className="h-4 w-4" />
                  Faucet
                  <ExternalLink className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(resource.explorer, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  Explorer
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Alert>
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <strong>Como usar:</strong>
            <br />
            1. Acesse o faucet da rede desejada
            <br />
            2. Cole o endereço da sua carteira
            <br />
            3. Solicite os tokens de teste
            <br />
            4. Aguarde alguns minutos para receber
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}