# Deploy do Smart Contract NFT Gift Card

## Redes Configuradas

### 1. Polygon Amoy Testnet
- **Chain ID**: 80002
- **RPC URL**: https://rpc-amoy.polygon.technology/
- **Currency**: MATIC
- **Explorer**: https://amoy.polygonscan.com/
- **Faucet**: https://faucet.polygon.technology/

### 2. Sepolia Testnet  
- **Chain ID**: 11155111
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- **Currency**: SepoliaETH
- **Explorer**: https://sepolia.etherscan.io/
- **Faucet**: https://sepolia-faucet.pk910.de/

## Como fazer Deploy

### 1. Configurar Variáveis de Ambiente
```bash
# Criar arquivo .env na raiz do projeto
PRIVATE_KEY=sua_chave_privada_aqui
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/SEU_TOKEN_INFURA
```

### 2. Deploy na Polygon Amoy
```bash
npx hardhat run scripts/deploy-networks.cjs --network amoy
```

### 3. Deploy na Sepolia (quando tiver o token Infura)
```bash
npx hardhat run scripts/deploy-networks.cjs --network sepolia
```

## Funcionalidades Implementadas

✅ **Smart Contract NFT Gift Card**
- Mintagem de NFTs com saldo em ETH/MATIC
- Sistema de resgate e troco
- Cartões recarregáveis
- Metadados customizáveis

✅ **Interface Web3 Completa**
- Conexão com MetaMask
- Seleção de rede (Sepolia/Amoy)
- Formulário de mintagem completo
- Informações de faucets e explorers

✅ **Hooks React Otimizados**
- useWallet: Gerencia conexão da carteira
- useNFTContract: Interage com o smart contract
- Suporte multi-rede automático

## Como Usar na Plataforma

1. **Conectar Carteira**: Clique em "Conectar MetaMask"
2. **Escolher Rede**: Selecione Sepolia ou Amoy no seletor
3. **Obter Tokens**: Use os faucets para tokens de teste
4. **Mintar NFT**: Preencha o formulário e confirme a transação
5. **Verificar**: Veja seu NFT no explorer da blockchain

## Próximos Passos

Para produção, você pode:
- Configurar redes mainnet (Ethereum, Polygon)
- Implementar armazenamento IPFS para metadados
- Adicionar marketplace para compra/venda
- Integrar com APIs de comerciantes reais