import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw, CreditCard, Zap, ArrowRight, CheckCircle, Lock } from "lucide-react";
import { Link } from "wouter";

const Features = () => {
  useEffect(() => {
    document.title = "NFTGift - Recursos Avançados de Gift Cards";
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Gift Cards Reimaginados com Tecnologia NFT</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Descubra uma nova geração de cartões-presente utilizando blockchain 
          e tecnologia zero-knowledge para maior privacidade, segurança e valor.
        </p>
      </div>

      {/* Problem Statement */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-red-800 dark:text-red-300">Os Gift Cards Tradicionais Estão Quebrados</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Custos Elevados</h3>
            <p className="text-gray-600 dark:text-gray-300">
              US$ 4-7 por emissão, onerando comerciantes e clientes.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Fraudes e Desperdícios</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Duplicações, cartões não utilizados e saldos perdidos.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Experiência Complicada</h3>
            <p className="text-gray-600 dark:text-gray-300">
              UX deficiente, pouca inovação e liquidação demorada.
            </p>
          </div>
        </div>
      </div>

      {/* ZK Privacy Section */}
      <div className="mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <div className="inline-flex items-center bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-full mb-6">
              <Shield className="h-5 w-5 mr-2" />
              <span className="font-medium">Privacidade Zero-Knowledge</span>
            </div>
            <h2 className="text-3xl font-bold mb-6">Compre e Use sem Revelar seus Dados</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Nossa tecnologia de prova de conhecimento zero permite que você prove que tem saldo suficiente 
              sem revelar o valor atual ou seu histórico de transações.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Prove que tem saldo sem expor valores exatos</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Transações privadas não conectadas à sua identidade</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Proteja suas informações pessoais de compra</span>
              </li>
            </ul>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/10 p-8 rounded-2xl relative">
            <div className="absolute top-0 right-0 bg-purple-200 dark:bg-purple-800 h-24 w-24 rounded-bl-3xl rounded-tr-2xl -mt-6 -mr-6 z-0"></div>
            <div className="relative z-10">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-bold">Prova ZK Gerada</h3>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm mb-4">
                  <p className="mb-2">Proof Hash: 0x7f9e8d7c6b5a...</p>
                  <p className="mb-2">Verified: True</p>
                  <p className="mb-2">Proof Type: Balance ≥ 150 USDC</p>
                  <p>Merchant: Can verify without seeing balance</p>
                </div>
                <div className="flex">
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">zkSNARK protocol</span>
                </div>
              </div>

              <p className="text-purple-700 dark:text-purple-300 flex items-center mb-6">
                <Lock className="h-4 w-4 mr-2" />
                <span className="text-sm">Sua privacidade é protegida pela matemática</span>
              </p>

              <div className="flex justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Saiba mais sobre ZK Proofs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rechargeable Cards Section */}
      <div className="mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div className="order-2 md:order-1 bg-blue-50 dark:bg-blue-900/10 p-8 rounded-2xl relative">
            <div className="absolute top-0 left-0 bg-blue-200 dark:bg-blue-800 h-24 w-24 rounded-br-3xl rounded-tl-2xl -mt-6 -ml-6 z-0"></div>
            <div className="relative z-10">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
                <div className="flex items-center mb-4">
                  <RefreshCw className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold">Recarga de Gift Card</h3>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-500 dark:text-gray-400">Saldo Atual:</span>
                  <span className="font-semibold">0.089 ETH (≈ $150.00)</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-500 dark:text-gray-400">Após recarga:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">0.189 ETH (≈ $320.00)</span>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm mb-4">
                  <div className="flex justify-between mb-1">
                    <span>Quantidade de recarga:</span>
                    <span className="font-semibold">0.1 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de recarga:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">0% (vs. ~3-5% tradicional)</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                  Confirmar Recarga
                </button>
              </div>

              <p className="text-blue-700 dark:text-blue-300 flex items-center mb-6">
                <Zap className="h-4 w-4 mr-2" />
                <span className="text-sm">Recarga instantânea sem taxas ocultas</span>
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full mb-6">
              <RefreshCw className="h-5 w-5 mr-2" />
              <span className="font-medium">Cartões Recarregáveis</span>
            </div>
            <h2 className="text-3xl font-bold mb-6">Nunca Perca Valor com Gift Cards Expirados</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Nossos gift cards NFT são totalmente recarregáveis, permitindo que você adicione valor a qualquer 
              momento e receba notificações antes da expiração.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Recarregue com qualquer criptomoeda ou pagamento fiat</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Zero taxas de recarga, ao contrário dos gift cards tradicionais</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Notificações automáticas antes da expiração do saldo</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Estenda a validade a cada recarga, maximizando o valor</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Merchant Benefits */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Benefícios para Comerciantes</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Nossa plataforma oferece vantagens incomparáveis para lojas e empresas que desejam emitir gift cards.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Emissão Ultra-Barata</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Custa menos de 0,5% para emitir, comparado a 4-7% dos sistemas tradicionais. Economize milhares em taxas.
            </p>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="text-green-600 dark:text-green-400 font-medium">97% de economia em custos</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Liquidação Instantânea</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Receba pagamentos em stablecoins imediatamente após cada transação, sem esperar por processadores de pagamento.
            </p>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="text-blue-600 dark:text-blue-400 font-medium">Segundos vs. 2-3 dias de espera</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
              <Lock className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Sem Fraudes ou Chargebacks</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Tecnologia blockchain elimina fraudes, duplicações e contestações, reduzindo custos operacionais.
            </p>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <span className="text-purple-600 dark:text-purple-400 font-medium">Segurança criptográfica garantida</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 md:p-12 mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Diferenciais Técnicos</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2 text-primary">1</span>
              NFT padrão ERC-6551 com histórico dinâmico
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Smart NFTs que funcionam como contas inteligentes, com capacidade de armazenar histórico e
              realizar ações programáveis de forma autônoma.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2 text-primary">2</span>
              ZK Proofs para preservar privacidade
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Provas zero-knowledge (ZKP ≥ X) que permitem comprovar
              informações sem revelar os dados subjacentes. Privacidade matemática.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2 text-primary">3</span>
              Liquidação com USDC/BRLx via L2
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Utilizamos redes de camada 2 (Polygon, Base ou Stellar) para
              transações rápidas e de baixo custo, com liquidação em stablecoins.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2 text-primary">4</span>
              Marketplace opcional para revenda
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Os gift cards podem ser revendidos no marketplace secundário,
              criando liquidez e valor adicional para os portadores.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Comece a explorar o futuro dos gift cards</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Descubra hoje mesmo como os NFT gift cards podem transformar a maneira como você 
          dá e recebe presentes digitais.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
            <Link href="/marketplace">
              Explorar Marketplace
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/5">
            Para Comerciantes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Features;