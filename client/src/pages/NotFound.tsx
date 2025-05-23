import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Página Não Encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Oops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Página Anterior
          </Button>
        </div>

        <div className="mt-8 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Se você acha que isso é um erro, entre em contato conosco ou tente novamente mais tarde.
          </p>
        </div>
      </div>
    </div>
  );
}