// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTGiftCard is ERC721, ERC721URIStorage, ReentrancyGuard, Ownable {
    struct Saldo {
        uint256 valor;
        uint256 usado;
        string comerciante;
        string categoria;
        bool recarregavel;
        uint256 dataExpiracao;
        string metadata;
    }

    mapping(uint256 => Saldo) private saldos;
    mapping(address => uint256[]) private userGiftCards;
    uint256 private _nextTokenId;

    constructor() ERC721("NFT Gift Card", "NFTGC") Ownable(msg.sender) {}

    function mintGiftCard(
        address para,
        string memory comerciante,
        string memory categoria,
        uint256 valorInicial,
        bool recarregavel,
        uint256 dataExpiracao,
        string memory uri,
        string memory metadata
    ) public payable returns (uint256) {
        require(msg.value > 0, "É necessário enviar ETH para criar o cartão");
        
        uint256 tokenId = _nextTokenId++;
        _mint(para, tokenId);
        _setTokenURI(tokenId, uri);
        
        saldos[tokenId] = Saldo({
            valor: msg.value,
            usado: 0,
            comerciante: comerciante,
            categoria: categoria,
            recarregavel: recarregavel,
            dataExpiracao: dataExpiracao,
            metadata: metadata
        });
        
        userGiftCards[para].push(tokenId);
        
        emit NovoGiftCard(tokenId, para, msg.value);
        return tokenId;
    }

    function redeemGiftCard(uint256 tokenId, uint256 valor) public nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Não autorizado");
        require(valor <= saldoDisponivel(tokenId), "Saldo insuficiente");
        require(block.timestamp <= saldos[tokenId].dataExpiracao, "Gift card expirado");
        
        saldos[tokenId].usado += valor;
        emit SaldoGastado(tokenId, valor, saldoDisponivel(tokenId));
    }

    function rechargeGiftCard(uint256 tokenId) public payable nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Não autorizado");
        require(saldos[tokenId].recarregavel, "Cartão não é recarregável");
        require(msg.value > 0, "É necessário enviar ETH para recarregar");
        
        saldos[tokenId].valor += msg.value;
        emit CartaoRecarregado(tokenId, msg.value, saldoDisponivel(tokenId));
    }

    function saldoDisponivel(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token não existe");
        return saldos[tokenId].valor - saldos[tokenId].usado;
    }

    function gerarTroco(uint256 tokenId, uint256 valor) public nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Não autorizado");
        uint256 saldoAtual = saldoDisponivel(tokenId);
        require(saldoAtual >= valor, "Saldo insuficiente para troco");
        
        uint256 novoTokenId = _nextTokenId++;
        _mint(msg.sender, novoTokenId);
        
        // Copiar os metadados do cartão original
        saldos[novoTokenId] = Saldo({
            valor: valor,
            usado: 0,
            comerciante: saldos[tokenId].comerciante,
            categoria: saldos[tokenId].categoria,
            recarregavel: saldos[tokenId].recarregavel,
            dataExpiracao: saldos[tokenId].dataExpiracao,
            metadata: saldos[tokenId].metadata
        });
        
        // Marcar o valor original como usado
        saldos[tokenId].usado += valor;
        
        userGiftCards[msg.sender].push(novoTokenId);
        emit TrocoGerado(tokenId, novoTokenId, valor);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function getGiftCard(uint256 tokenId) public view returns (
        string memory comerciante,
        string memory categoria,
        uint256 valorTotal,
        uint256 saldoRestante,
        bool recarregavel,
        uint256 dataExpiracao,
        string memory metadata
    ) {
        require(_exists(tokenId), "Token não existe");
        Saldo storage saldo = saldos[tokenId];
        return (
            saldo.comerciante,
            saldo.categoria,
            saldo.valor,
            saldo.valor - saldo.usado,
            saldo.recarregavel,
            saldo.dataExpiracao,
            saldo.metadata
        );
    }

    function getUserGiftCards(address user) public view returns (uint256[] memory) {
        return userGiftCards[user];
    }

    function isExpired(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Token não existe");
        return block.timestamp > saldos[tokenId].dataExpiracao;
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721URIStorage) returns (bool) {
        return ERC721.supportsInterface(interfaceId) || ERC721URIStorage.supportsInterface(interfaceId);
    }

    event NovoGiftCard(uint256 indexed tokenId, address comprador, uint256 saldo);
    event SaldoGastado(uint256 indexed tokenId, uint256 valor, uint256 saldoRestante);
    event CartaoRecarregado(uint256 indexed tokenId, uint256 valor, uint256 novoSaldo);
    event TrocoGerado(uint256 originalTokenId, uint256 novoTokenId, uint256 valor);
}