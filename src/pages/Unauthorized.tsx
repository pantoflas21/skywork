import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Acesso Não Autorizado
        </h1>
        
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página. 
          Entre em contato com o administrador se acredita que isto é um erro.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="h-4 w-4" />
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}
