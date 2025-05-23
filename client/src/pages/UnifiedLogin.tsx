import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { Lock, Wallet, Smartphone, Building, User, LucideShield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define the NFT Auth type
interface NFTAuth {
  id: string;
  name: string;
  image: string;
  contractAddress: string;
  tokenId: string;
  verified: boolean;
  accessLevel: string;
}

const UnifiedLogin = () => {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { isConnected, connect, walletAddress, isConnecting } = useWallet();
  
  // Common state
  const [selectedSegment, setSelectedSegment] = useState<string>('b2c');
  const [error, setError] = useState('');
  
  // B2C (Consumer) states
  const [activeTab, setActiveTab] = useState('wallet');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTAuth | null>(null);
  const [authCode, setAuthCode] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  
  // B2B (Business) states
  const [companyId, setCompanyId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [businessPassword, setBusinessPassword] = useState('');
  
  // Admin states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Mock NFTs for demonstration
  const mockNFTs: NFTAuth[] = [
    {
      id: '1',
      name: 'Premium Access Card',
      image: 'https://via.placeholder.com/200x200/3B82F6/FFFFFF?text=Premium',
      contractAddress: '0x1234...abcd',
      tokenId: '001',
      verified: true,
      accessLevel: 'premium'
    },
    {
      id: '2', 
      name: 'VIP Membership NFT',
      image: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=VIP',
      contractAddress: '0x5678...efgh',
      tokenId: '025',
      verified: true,
      accessLevel: 'vip'
    },
    {
      id: '3',
      name: 'Basic User Token',
      image: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=Basic',
      contractAddress: '0x9abc...ijkl',
      tokenId: '142',
      verified: false,
      accessLevel: 'basic'
    }
  ];

  // Consumer (B2C) handlers
  const handleWalletConnect = async (type: string) => {
    try {
      setSelectedWallet(type);
      await connect(type);
      setTimeout(() => {
        if (type === 'MetaMask' || type === 'metamask') {
          setCurrentStep(2);
          // For demo, set mock NFTs
          setIsAuthenticating(false);
        } else {
          setLocation('/dashboard');
        }
      }, 500);
    } catch (error) {
      setError('Failed to connect wallet. Please try again.');
    }
  };

  const handleNFTSelection = (nft: NFTAuth) => {
    setSelectedNFT(nft);
    setCurrentStep(3);
    // Generate mock auth code
    setAuthCode(`${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleVerifyNFT = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      toast({
        title: "Authentication successful",
        description: `You're now logged in with your NFT: ${selectedNFT?.name}`,
      });
      setLocation('/dashboard');
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: "Social Login",
      description: `Login with ${provider} will be implemented soon.`,
    });
  };

  const handleEmailLogin = () => {
    setShowEmailForm(true);
  };

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // For demonstration purposes - in a real app, this would check against a database
    if (password === '123') {
      // Set authentication info
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('username', username || 'user');
      
      toast({
        title: "Login successful",
        description: "Welcome back to the platform!",
      });
      setLocation('/dashboard');
    } else {
      setError('Invalid username or password (use "123" for all logins)');
    }
  };

  // Business (B2B) handlers
  const handleBusinessLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!companyId || !businessPassword) {
      setError('Please fill in all required fields (Employee ID is optional)');
      return;
    }
    
    // For demonstration purposes - in a real app, this would check against a database
    if (businessPassword === '123') {
      // Set authentication info
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('username', companyId);
      localStorage.setItem('user_role', 'business');
      
      toast({
        title: "Business Login Successful",
        description: "Welcome to the B2B platform.",
      });
      setLocation('/b2b-dashboard');
    } else {
      setError('Invalid company credentials (use "123" for all logins)');
    }
  };

  // Admin login handler
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!adminPassword) {
      setError('Please enter the admin password');
      return;
    }
    
    // For demonstration purposes - in a real app, this would be more secure
    if (adminPassword === '123') {
      // Set authentication info
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('username', adminUsername || 'admin');
      localStorage.setItem('user_role', 'admin');
      
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the marketplace!",
      });
      setLocation('/marketplace');
    } else {
      setError('Invalid admin password (use "123" for all logins)');
    }
  };

  const getAccessLevelColor = (accessLevel: string) => {
    if (accessLevel === 'premium') {
      return 'from-blue-500 to-indigo-500';
    } else if (accessLevel === 'vip') {
      return 'from-yellow-500 to-amber-500';
    } else {
      return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Login Type Selector */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Unified Platform Access
          </h1>
          
          <div className="flex justify-center mt-6 mb-8">
            <div className="bg-gray-800/50 p-1 rounded-full flex">
              <Button
                variant={selectedSegment === 'b2c' ? "default" : "ghost"}
                className={`rounded-full px-6 ${selectedSegment === 'b2c' ? "" : "text-gray-400"}`}
                onClick={() => setSelectedSegment('b2c')}
              >
                <User className="mr-2 h-4 w-4" />
                Personal
              </Button>
              
              <Button
                variant={selectedSegment === 'b2b' ? "default" : "ghost"}
                className={`rounded-full px-6 ${selectedSegment === 'b2b' ? "" : "text-gray-400"}`}
                onClick={() => setSelectedSegment('b2b')}
              >
                <Building className="mr-2 h-4 w-4" />
                Business
              </Button>
              
              <Button
                variant={selectedSegment === 'admin' ? "default" : "ghost"}
                className={`rounded-full px-6 ${selectedSegment === 'admin' ? "" : "text-gray-400"}`}
                onClick={() => setSelectedSegment('admin')}
              >
                <LucideShield className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-2">
            Use password "123" for all logins in this demo
          </p>
        </div>
        
        {/* Admin Section */}
        {selectedSegment === 'admin' && (
          <Card className="border-gray-700 bg-gray-900/60 text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Administrator Access</CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Access the administrative dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleAdminLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminUsername">Admin Username (Optional)</Label>
                    <Input 
                      id="adminUsername"
                      placeholder="Enter your admin username" 
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Admin Password</Label>
                    <Input 
                      id="adminPassword"
                      type="password"
                      placeholder="••••••••" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                      required
                    />
                    <p className="text-xs text-blue-400">
                      Use "123" for the demo admin password
                    </p>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-200">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                    Administrator Login
                  </Button>
                  
                  <div className="text-center text-sm text-gray-400 mt-4">
                    <LucideShield className="inline-block h-4 w-4 mr-1" />
                    Administrative access is restricted and monitored
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        {/* B2C Section */}
        {selectedSegment === 'b2c' && (
          <Card className="border-gray-700 bg-gray-900/60 text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Consumer Access</CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Access the platform with your personal account
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {currentStep === 1 && (
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="wallet">Wallet</TabsTrigger>
                    <TabsTrigger value="credentials">Credentials</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="wallet" className="space-y-6">
                    <div className="space-y-4">
                      <Button
                        onClick={() => handleWalletConnect('MetaMask')}
                        className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                        disabled={isConnecting}
                      >
                        {isConnecting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full"></div>
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Wallet className="mr-2 h-5 w-5" />
                            Connect with MetaMask
                          </>
                        )}
                      </Button>
                      
                      <Button
                        onClick={() => handleWalletConnect('WalletConnect')}
                        variant="outline"
                        className="w-full h-12 border-blue-500 hover:bg-blue-500/10 text-white"
                        disabled={isConnecting}
                      >
                        <Wallet className="mr-2 h-5 w-5" />
                        Connect with WalletConnect
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="bg-gray-900 px-4 text-gray-400">
                            Or sign in with
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <Button
                          onClick={() => handleSocialLogin('google')}
                          variant="outline"
                          className="h-12 flex items-center gap-2 border-gray-600 hover:border-red-500 text-white hover:bg-red-500/10"
                        >
                          <div className="w-5 h-5 bg-red-500 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">G</span>
                          </div>
                          <span>Google</span>
                        </Button>
                        
                        <Button
                          onClick={() => handleSocialLogin('facebook')}
                          variant="outline"
                          className="h-12 flex items-center gap-2 border-gray-600 hover:border-blue-600 text-white hover:bg-blue-600/10"
                        >
                          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">f</span>
                          </div>
                          <span>Facebook</span>
                        </Button>
                        
                        <Button
                          onClick={() => handleEmailLogin()}
                          variant="outline"
                          className="h-12 flex items-center gap-2 border-gray-600 hover:border-green-500 text-white hover:bg-green-500/10"
                        >
                          <Smartphone className="h-5 w-5" />
                          <span>Email</span>
                        </Button>
                      </div>
                      
                      {showEmailForm && (
                        <div className="space-y-3 mt-4 p-4 border border-gray-700 rounded-md bg-gray-800/50">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email"
                              placeholder="your.email@example.com" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                              id="password"
                              type="password"
                              placeholder="••••••••" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          
                          <Button 
                            className="w-full mt-2"
                            onClick={() => {
                              toast({
                                title: "Email Login",
                                description: "Email login will be implemented soon."
                              });
                            }}
                          >
                            Login with Email
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="credentials" className="space-y-4">
                    <form onSubmit={handleCredentialsLogin}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username"
                            placeholder="Enter your username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-gray-800 border-gray-700"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Button variant="link" size="sm" className="p-0 h-auto text-xs text-blue-400">
                              Forgot password?
                            </Button>
                          </div>
                          <Input 
                            id="password"
                            type="password"
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-800 border-gray-700"
                            required
                          />
                        </div>

                        {error && (
                          <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-200">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        
                        <Button type="submit" className="w-full">
                          Sign In
                        </Button>
                        
                        <p className="text-sm text-gray-400 text-center">
                          Don't have an account?{" "}
                          <span 
                            className="text-blue-400 cursor-pointer hover:underline"
                            onClick={() => {
                              toast({
                                title: "Registration",
                                description: "Registration feature will be implemented soon."
                              });
                            }}
                          >
                            Sign up
                          </span>
                        </p>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-block p-3 rounded-full bg-green-500/20 text-green-400 mb-4">
                      <Wallet className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-medium mb-1">Wallet Connected</h3>
                    <p className="text-gray-400">
                      {walletAddress ? `Address: ${walletAddress}` : 'Select an NFT to authenticate'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockNFTs.map((nft) => (
                      <div 
                        key={nft.id}
                        className="relative border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all"
                        onClick={() => handleNFTSelection(nft)}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-full h-32 rounded-md mb-2 overflow-hidden">
                            <img 
                              src={nft.image} 
                              alt={nft.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="font-medium">{nft.name}</h4>
                          <p className="text-xs text-gray-400 mb-2">Token ID: {nft.tokenId}</p>
                          <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getAccessLevelColor(nft.accessLevel)} text-white`}>
                            {nft.accessLevel.charAt(0).toUpperCase() + nft.accessLevel.slice(1)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      className="border-gray-700 hover:bg-gray-800"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "NFT Authentication",
                          description: "Please select an NFT to proceed with authentication"
                        });
                      }}
                      disabled
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && selectedNFT && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-block p-3 rounded-full bg-blue-500/20 text-blue-400 mb-4">
                      <LucideShield className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Verify NFT Ownership</h3>
                    <p className="text-gray-400 mb-4">
                      We need to verify you own this NFT by signing a message
                    </p>
                    
                    <div className="bg-gray-800/80 p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-center mb-4">
                        <img 
                          src={selectedNFT.image} 
                          alt={selectedNFT.name} 
                          className="w-16 h-16 rounded-md"
                        />
                        <div className="ml-4 text-left">
                          <h4 className="font-medium">{selectedNFT.name}</h4>
                          <p className="text-xs text-gray-400">Token ID: {selectedNFT.tokenId}</p>
                          <p className="text-xs text-gray-400">Contract: {selectedNFT.contractAddress}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-900 p-3 rounded border border-gray-700 mb-4">
                        <p className="text-xs font-mono text-gray-300 break-all">
                          Sign this message to verify you own NFT #{selectedNFT.tokenId}. Auth code: {authCode}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      className="border-gray-700 hover:bg-gray-800"
                      onClick={() => setCurrentStep(2)}
                      disabled={isAuthenticating}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleVerifyNFT}
                      disabled={isAuthenticating}
                    >
                      {isAuthenticating ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full"></div>
                          Verifying...
                        </>
                      ) : (
                        <>Sign & Verify</>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* B2B Section */}
        {selectedSegment === 'b2b' && (
          <Card className="border-gray-700 bg-gray-900/60 text-white backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Business Portal</CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Access your company's business dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleBusinessLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyId">Company ID</Label>
                    <Input 
                      id="companyId"
                      placeholder="Enter your company ID" 
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID (Optional)</Label>
                    <Input 
                      id="employeeId"
                      placeholder="Enter your employee ID" 
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessPassword">Password</Label>
                    <Input 
                      id="businessPassword"
                      type="password"
                      placeholder="••••••••" 
                      value={businessPassword}
                      onChange={(e) => setBusinessPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700"
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive" className="bg-red-900/30 border-red-800 text-red-200">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full">
                    Business Login
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-gray-900 px-4 text-gray-400">
                        Or connect with Web3
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleWalletConnect('MetaMask')}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full"></div>
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-5 w-5" />
                        Connect Business Wallet
                      </>
                    )}
                  </Button>
                </div>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Need a business account?{" "}
                  <span 
                    className="text-blue-400 cursor-pointer hover:underline"
                    onClick={() => {
                      toast({
                        title: "Business Registration",
                        description: "Please contact our sales team to create a business account."
                      });
                    }}
                  >
                    Contact Sales
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            <Lock className="inline-block h-3 w-3 mr-1" />
            Your session is secured with blockchain technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;