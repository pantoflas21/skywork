import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  GraduationCap, 
  FileText, 
  LogOut,
  UserPlus,
  BookOpen,
  Calendar,
  ClipboardCheck
} from 'lucide-react';

const SecretaryDashboard: React.FC = () => {
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
              <p className="text-sm text-gray-600">Painel da Secretaria</p>
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
              <Users className="h-5 w-5" />
              <span>Alunos</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BookOpen className="h-5 w-5" />
              <span>Turmas</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <FileText className="h-5 w-5" />
              <span>Planos de Aula</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Painel da Secretaria</h2>
            <p className="text-gray-600">Gestão de alunos, turmas e atividades pedagógicas</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Matricular Aluno</h3>
                  <p className="text-sm text-gray-600">Cadastrar novo estudante</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Criar Turma</h3>
                  <p className="text-sm text-gray-600">Nova classe escolar</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <ClipboardCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fiscalizar Planos</h3>
                  <p className="text-sm text-gray-600">Revisar aulas dos professores</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Alunos Matriculados</p>
                  <p className="text-2xl font-bold text-gray-900">342</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Turmas Ativas</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Planos Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Recent Students */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Matrículas Recentes</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Nome</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Turma</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Data</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-sm text-gray-900">Ana Clara Silva</td>
                    <td className="py-3 text-sm text-gray-600">3º Ano A</td>
                    <td className="py-3 text-sm text-gray-600">20/05/2024</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Ativo</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 text-sm text-gray-900">Bruno Santos</td>
                    <td className="py-3 text-sm text-gray-600">5º Ano B</td>
                    <td className="py-3 text-sm text-gray-600">19/05/2024</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Ativo</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-sm text-gray-900">Carla Oliveira</td>
                    <td className="py-3 text-sm text-gray-600">1º Ano EM</td>
                    <td className="py-3 text-sm text-gray-600">18/05/2024</td>
                    <td className="py-3">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pendente</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SecretaryDashboard;