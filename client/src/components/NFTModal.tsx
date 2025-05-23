import { NFTGiftCard, Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Star, Shield, ArrowUpDown, Calendar, RefreshCw, Zap, ChevronDown, Eye, CreditCard } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TRANSACTIONS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface NFTModalProps {
  nft: NFTGiftCard;
  isOpen: boolean;
  onClose: () => void;
}

export const NFTModal = ({ nft, isOpen, onClose }: NFTModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [rechargeAmount, setRechargeAmount] = useState<number>(0);
  const [rechargeOptions] = useState([0.05, 0.1, 0.25, 0.5]);
  const [isRecharging, setIsRecharging] = useState(false);
  const [showZkProof, setShowZkProof] = useState(false);
  const { toast } = useToast();

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleRecharge = () => {
    if (rechargeAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please select a valid recharge amount",
        variant: "destructive",
      });
      return;
    }

    setIsRecharging(true);
    
    // Simulação de recarga
    setTimeout(() => {
      setIsRecharging(false);
      toast({
        title: "Recharge successful",
        description: `Added ${rechargeAmount} ETH to your gift card!`,
      });
    }, 2000);
  };

  const generateZkProof = () => {
    setShowZkProof(true);
    toast({
      title: "ZK Proof Generated",
      description: "Proof of balance created without revealing the actual amount",
    });
  };

  const filteredTransactions = TRANSACTIONS.filter(tx => tx.giftCardId === nft.id);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      gaming: "bg-primary",
      restaurants: "bg-orange-500",
      travel: "bg-blue-500",
      shopping: "bg-pink-500",
      entertainment: "bg-purple-500",
      subscription: "bg-indigo-500",
      services: "bg-teal-500",
      defi: "bg-green-600",
      nft: "bg-purple-600",
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute right-8 top-8 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md z-10"
        >
          <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="relative">
              <img
                src={nft.image}
                alt={nft.title}
                className="w-full h-auto rounded-xl shadow-lg"
              />
              {nft.merchant && (
                <div className="absolute bottom-4 left-4 flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 shadow-md">
                  {nft.merchant.logo && (
                    <img 
                      src={nft.merchant.logo} 
                      alt={nft.merchant.name} 
                      className="w-8 h-8 rounded-full mr-2 border border-gray-200 dark:border-gray-700"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">{nft.merchant.name}</p>
                    {nft.merchant.verified && (
                      <div className="flex items-center text-green-600 dark:text-green-400 text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        <span>Verified Merchant</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">NFT Properties</h4>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Contract Address</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm font-mono">{nft.contractAddress}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Token ID</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm font-mono">{nft.tokenId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Blockchain</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm">{nft.blockchain}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Standard</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm">{nft.standard || "ERC-721"}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Created</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm">{nft.created}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Expires</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm">{nft.expirationDate}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {nft.isRechargeable && (
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Rechargeable
                  </Badge>
                )}
                {nft.hasZkPrivacy && (
                  <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                    <Shield className="h-3 w-3 mr-1" />
                    ZK Privacy
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 p-6 md:p-8 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800">
            <Tabs defaultValue="details">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                {nft.isRechargeable && (
                  <TabsTrigger value="recharge" className="flex-1">Recharge</TabsTrigger>
                )}
                {nft.hasZkPrivacy && (
                  <TabsTrigger value="zkproof" className="flex-1">ZK Proof</TabsTrigger>
                )}
                {filteredTransactions.length > 0 && (
                  <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="details">
                <div className="mb-2">
                  <span className={`${getCategoryColor(nft.category)} text-white text-xs px-2 py-1 rounded-full`}>
                    {nft.category.charAt(0).toUpperCase() + nft.category.slice(1)}
                  </span>
                  {nft.isFeatured && (
                    <span className="bg-accent text-white text-xs px-2 py-1 rounded-full ml-2">
                      Featured
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2">{nft.title}</h2>
                {nft.rating && (
                  <div className="flex items-center mb-6">
                    <div className="flex items-center space-x-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < (nft.rating || 0) ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">{nft.reviews || 0} reviews</span>
                  </div>
                )}
                
                <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300 mb-8">
                  <p className="mb-4">{nft.description}</p>
                  {nft.benefits && (
                    <>
                      <p className="mb-4">This exclusive {nft.category} voucher includes:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        {nft.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                      {nft.validFor && (
                        <p className="mt-4">Valid for {nft.validFor}</p>
                      )}
                    </>
                  )}
                </div>
                
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current price</p>
                      <div className="flex items-center space-x-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-bold text-2xl">{nft.price.eth} ETH</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">≈ ${nft.price.usd.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <button 
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                          onClick={decreaseQuantity}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="font-medium text-lg w-8 text-center">{quantity}</span>
                        <button 
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                          onClick={increaseQuantity}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button className="bg-primary text-white px-4 py-3 rounded-lg font-medium hover:bg-primary/90 transition">
                    Buy Now
                  </Button>
                  <Button variant="outline" className="border border-primary text-primary px-4 py-3 rounded-lg font-medium hover:bg-primary/5 transition">
                    Add to Cart
                  </Button>
                </div>
              </TabsContent>
              
              {nft.isRechargeable && (
                <TabsContent value="recharge">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Recharge Your Gift Card</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Add more value to your gift card to continue enjoying its benefits and extend its validity.
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Current Balance</span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {nft.balance?.eth} ETH (≈ ${nft.balance?.usd.toFixed(2)})
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Expiration Date</span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">
                          {nft.expirationDate || "No expiration"}
                        </span>
                      </div>
                      {nft.totalRecharges !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 text-sm">Total Recharges</span>
                          <span className="text-gray-900 dark:text-gray-100 font-medium">{nft.totalRecharges}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">Select Recharge Amount</label>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {rechargeOptions.map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={rechargeAmount === amount ? "default" : "outline"}
                            onClick={() => setRechargeAmount(amount)}
                            className="flex justify-between items-center"
                          >
                            <span>{amount} ETH</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              ≈ ${(amount * 1800).toFixed(2)}
                            </span>
                          </Button>
                        ))}
                      </div>
                      
                      <Button
                        onClick={handleRecharge}
                        disabled={isRecharging || rechargeAmount <= 0}
                        className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-primary/90 transition"
                      >
                        {isRecharging ? (
                          <div className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            <span>Recharge Now</span>
                          </div>
                        )}
                      </Button>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p className="mb-2">Benefits of recharging:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Extend validity of your card</li>
                        <li>No additional fees unlike traditional gift cards</li>
                        <li>Get instant notification before expiry</li>
                        <li>Recharge with any crypto or fiat payment</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {nft.hasZkPrivacy && (
                <TabsContent value="zkproof">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Zero-Knowledge Privacy</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      This NFT gift card supports zero-knowledge proofs, allowing you to prove you own the card and have sufficient balance without revealing the actual amount.
                    </p>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4 rounded-lg mb-6">
                      <h4 className="flex items-center text-purple-800 dark:text-purple-300 font-medium mb-2">
                        <Shield className="h-5 w-5 mr-2" />
                        Enhanced Privacy Features
                      </h4>
                      <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-1">✓</div>
                          <span className="ml-2">Prove balance without revealing it (ZKP ≥ X)</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-1">✓</div>
                          <span className="ml-2">Private transactions using zero-knowledge proofs</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-1">✓</div>
                          <span className="ml-2">No transaction history linkability</span>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500 mt-1">✓</div>
                          <span className="ml-2">Anonymous redemption at merchants</span>
                        </li>
                      </ul>
                    </div>
                    
                    {showZkProof ? (
                      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
                        <h4 className="font-medium mb-2">Generated ZK Proof</h4>
                        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm overflow-x-auto">
                          <p>Proof Hash: 0x7f9e8d7c6b5a4e3d2c1b0f9e8d7c6b5a4e3d2c1b</p>
                          <p>Verified: True</p>
                          <p>Proof Type: Balance ≥ Threshold</p>
                          <p>Created: {new Date().toLocaleString()}</p>
                          <p>Status: Valid for 24 hours</p>
                        </div>
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                          This proof confirms you have sufficient balance without revealing the actual amount.
                          You can share this proof with merchants to verify you can make a purchase.
                        </p>
                      </div>
                    ) : (
                      <Button
                        onClick={generateZkProof}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition mb-6 flex items-center justify-center"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        <span>Generate Privacy Proof</span>
                      </Button>
                    )}
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p className="font-medium mb-2">How Zero-Knowledge Privacy Works:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Generate a proof that your balance meets a condition</li>
                        <li>The proof is verified on-chain without revealing your balance</li>
                        <li>Merchant can verify you have sufficient funds</li>
                        <li>Your personal data and spending habits remain private</li>
                      </ol>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {filteredTransactions.length > 0 && (
                <TabsContent value="history">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">Transaction History</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      View the history of purchases, recharges, and redemptions for this gift card.
                    </p>
                    
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Type
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Amount
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredTransactions.map((tx) => (
                              <tr key={tx.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {tx.type === "purchase" && (
                                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                        Purchase
                                      </Badge>
                                    )}
                                    {tx.type === "recharge" && (
                                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                        Recharge
                                      </Badge>
                                    )}
                                    {tx.type === "redeem" && (
                                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                        Redeem
                                      </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 dark:text-gray-100">
                                    {tx.amount.eth} ETH
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    ≈ ${tx.amount.usd.toFixed(2)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {tx.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                    {tx.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
