import { useState, createContext, useContext, ReactNode, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Verifica se o usuário já está autenticado no localStorage ao carregar
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Em uma aplicação real, isso seria uma chamada à API
    // Para simplificar, vamos usar credenciais fixas para demonstração
    
    // Simulando um atraso de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Credenciais de login predefinidas
    const validCredentials = [
      { username: 'admin', password: '123', role: 'admin', id: 1 },
      { username: 'usuario', password: '123', role: 'user', id: 2 },
    ];
    
    const match = validCredentials.find(
      cred => cred.username === username && cred.password === password
    );
    
    if (match) {
      const userData = {
        id: match.id,
        username: match.username,
        role: match.role,
      };
      
      // Salvando no estado
      setUser(userData);
      setIsAuthenticated(true);
      
      // Salvando no localStorage para persistência
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_user');
  };

  const userRole = user?.role || null;

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        userRole,
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}