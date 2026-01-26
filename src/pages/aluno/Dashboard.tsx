import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  LogOut,
  BarChart3,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">ALETHEIA</h1>
              <p className="text-sm text-gray-600">Portal do Aluno</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4 space-y-2">
            <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-primary text-white rounded-lg">
              <Calendar className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BarChart3 className="h-5 w-5" />
              <span>Notas</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Clock className="h-5 w-5" />
              <span>Frequência</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <DollarSign className="h-5 w-5" />
              <span>Financeiro</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BookOpen className="h-5 w-5" />
              <span>Horários</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Bem-vindo, João Silva!</h2>
            <p className="text-gray-600">3º Ano A - Ensino Médio</p>
          </div>

          {/* Academic Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Média Geral</p>
                  <p className="text-2xl font-bold text-green-600">8.4</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Frequência</p>
                  <p className="text-2xl font-bold text-blue-600">96%</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mensalidade</p>
                  <p className="text-2xl font-bold text-green-600">Em dia</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Situação</p>
                  <p className="text-2xl font-bold text-green-600">Aprovado</p>
                </div>
                <GraduationCap className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Grades by Subject */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas por Disciplina - 1º Bimestre</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Disciplina</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600">1º Bim</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600">2º Bim</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600">3º Bim</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600">4º Bim</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600">Média</th>
                    <th className="text-center py-2 text-sm font-medium text-gray-600">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-sm text-gray-900">Matemática</td>
                    <td className="py-3 text-sm text-center text-green-600 font-medium">8.5</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-600">8.5</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aprovado</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-sm text-gray-900">Português</td>
                    <td className="py-3 text-sm text-center text-green-600 font-medium">9.0</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-600">9.0</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aprovado</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-sm text-gray-900">História</td>
                    <td className="py-3 text-sm text-center text-green-600 font-medium">7.8</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-600">7.8</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aprovado</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-sm text-gray-900">Geografia</td>
                    <td className="py-3 text-sm text-center text-green-600 font-medium">8.2</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-600">8.2</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Aprovado</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm text-gray-900">Física</td>
                    <td className="py-3 text-sm text-center text-yellow-600 font-medium">6.5</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-400">-</td>
                    <td className="py-3 text-sm text-center text-gray-600">6.5</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Recuperação</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Situação Financeira</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Mensalidades 2024</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm text-gray-700">Janeiro</span>
                    <span className="text-sm text-green-600 font-medium">Pago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm text-gray-700">Fevereiro</span>
                    <span className="text-sm text-green-600 font-medium">Pago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm text-gray-700">Março</span>
                    <span className="text-sm text-green-600 font-medium">Pago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm text-gray-700">Abril</span>
                    <span className="text-sm text-green-600 font-medium">Pago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm text-gray-700">Maio</span>
                    <span className="text-sm text-blue-600 font-medium">Vence em 15/05</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Próximos Vencimentos</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">Mensalidade Maio</span>
                      <span className="text-sm text-blue-600">R$ 1.650,00</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Vencimento: 15/05/2024</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">Material Didático</span>
                      <span className="text-sm text-gray-600">R$ 450,00</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Vencimento: 30/05/2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;