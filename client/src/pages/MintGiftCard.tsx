import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { useNFTContract, MintGiftCardParams } from '@/hooks/useNFTContract';
import { NetworkSelector } from '@/components/NetworkSelector';
import { 
  Gift, 
  Wallet, 
  Clock, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Coins,
  Calendar,
  Store,
  Tag,
  User,
  FileText
} from 'lucide-react';

const mintFormSchema = z.object({
  recipient: z.string().min(42, 'Endereço de carteira válido é obrigatório').max(42),
  merchant: z.string().min(1, 'Nome do comerciante é obrigatório').max(100),
  category: z.string().min(1, 'Categoria é obrigatória'),
  amount: z.string().min(1, 'Valor é obrigatório').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Valor deve ser maior que 0'
  ),
  rechargeable: z.boolean().default(false),
  expirationDays: z.number().min(1, 'Mínimo 1 dia').max(3650, 'Máximo 10 anos'),
  metadata: z.string().max(500, 'Máximo 500 caracteres')
});

type MintFormData = z.infer<typeof mintFormSchema>;

const categories = [
  'E-commerce',
  'Alimentação',
  'Entretenimento',
  'Educação',
  'Saúde',
  'Tecnologia',
  'Varejo',
  'Serviços',
  'Outros'
];

export default function MintGiftCard() {
  const { isConnected, walletAddress, connect } = useWallet();
  const { mintGiftCard, isLoading, error, contractAddress, currentNetwork } = useNFTContract();
  const { toast } = useToast();
  const [mintResult, setMintResult] = useState<{
    success: boolean;
    transactionHash?: string;
    tokenId?: string;
  } | null>(null);

  const form = useForm<MintFormData>({
    resolver: zodResolver(mintFormSchema),
    defaultValues: {
      recipient: walletAddress || '',
      merchant: '',
      category: '',
      amount: '',
      rechargeable: false,
      expirationDays: 365,
      metadata: ''
    }
  });

  // Update recipient when wallet connects
  if (walletAddress && form.getValues('recipient') !== walletAddress) {
    form.setValue('recipient', walletAddress);
  }

  const onSubmit = async (data: MintFormData) => {
    if (!isConnected) {
      toast({
        title: "Carteira não conectada",
        description: "Conecte sua carteira para continuar",
        variant: "destructive"
      });
      return;
    }

    try {
      const params: MintGiftCardParams = {
        recipient: data.recipient,
        merchant: data.merchant,
        category: data.category,
        amount: data.amount,
        rechargeable: data.rechargeable,
        expirationDays: data.expirationDays,
        metadata: data.metadata || JSON.stringify({
          merchant: data.merchant,
          category: data.category,
          createdAt: new Date().toISOString()
        })
      };

      const result = await mintGiftCard(params);
      
      setMintResult(result);
      
      toast({
        title: "NFT Gift Card Mintado!",
        description: `Token ID: ${result.tokenId}`,
        variant: "default"
      });

      // Reset form after successful mint
      form.reset({
        recipient: walletAddress || '',
        merchant: '',
        category: '',
        amount: '',
        rechargeable: false,
        expirationDays: 365,
        metadata: ''
      });

    } catch (error: any) {
      toast({
        title: "Erro na Mintagem",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Wallet className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Conecte sua Carteira</CardTitle>
              <CardDescription>
                Para mintar NFT Gift Cards, você precisa conectar uma carteira Web3
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => connect('injected')} className="w-full">
                Conectar MetaMask
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mintar NFT Gift Card</h1>
          <p className="text-muted-foreground">
            Crie um novo NFT Gift Card na blockchain com saldo e metadados personalizados
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Dados do Gift Card
                </CardTitle>
                <CardDescription>
                  Preencha as informações para criar o NFT Gift Card
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="recipient"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Destinatário
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="0x..." {...field} />
                          </FormControl>
                          <FormDescription>
                            Endereço da carteira que receberá o NFT
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="merchant"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Store className="h-4 w-4" />
                              Comerciante
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Amazon, McDonald's..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              Categoria
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione categoria" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Coins className="h-4 w-4" />
                              Valor (ETH)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.001"
                                placeholder="0.1"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Valor em ETH para o Gift Card
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expirationDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Expiração (dias)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="3650"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Dias até expirar (1-3650)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="rechargeable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              Recarregável
                            </FormLabel>
                            <FormDescription>
                              Permitir que o gift card seja recarregado após uso
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metadata"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Metadados (Opcional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Informações adicionais sobre o Gift Card..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Dados personalizados para armazenar no NFT
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <Clock className="mr-2 h-4 w-4 animate-spin" />
                          Mintando...
                        </>
                      ) : (
                        <>
                          <Gift className="mr-2 h-4 w-4" />
                          Mintar NFT Gift Card
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Carteira</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-mono text-xs break-all">
                    {walletAddress}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Contrato NFT</p>
                  <p className="font-mono text-xs break-all">
                    {contractAddress}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Success Result */}
            {mintResult?.success && (
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800 dark:text-green-200 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Mintagem Concluída!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mintResult.tokenId && (
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-300">Token ID</p>
                      <Badge variant="secondary" className="font-mono">
                        #{mintResult.tokenId}
                      </Badge>
                    </div>
                  )}
                  
                  {mintResult.transactionHash && (
                    <div>
                      <p className="text-sm text-green-700 dark:text-green-300">Transaction Hash</p>
                      <p className="font-mono text-xs break-all text-green-800 dark:text-green-200">
                        {mintResult.transactionHash}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como Funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <p>Preencha os dados do Gift Card</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <p>Confirme a transação na sua carteira</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <p>Receba o NFT Gift Card na blockchain</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}