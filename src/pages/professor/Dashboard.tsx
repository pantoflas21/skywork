import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  LogOut,
  Calendar,
  ClipboardList,
  BarChart3,
  Brain,
  FileText
} from 'lucide-react';

const TeacherDashboard: React.FC = () => {
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
              <p className="text-sm text-gray-600">Painel do Professor</p>
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
              <span>Turmas</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BookOpen className="h-5 w-5" />
              <span>Aulas</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <ClipboardList className="h-5 w-5" />
              <span>Chamada</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <BarChart3 className="h-5 w-5" />
              <span>Notas</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <Brain className="h-5 w-5" />
              <span>Assistente IA</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <FileText className="h-5 w-5" />
              <span>Provas</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Painel do Professor</h2>
            <p className="text-gray-600">Gerencie suas turmas, aulas e avaliações</p>
          </div>

          {/* Bimestre Selector */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecionar Bimestre</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-primary text-white rounded-lg font-medium">
                1º Bimestre
              </button>
              <button className="p-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                2º Bimestre
              </button>
              <button className="p-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                3º Bimestre
              </button>
              <button className="p-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">
                4º Bimestre
              </button>
            </div>
          </div>

          {/* My Classes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">7º Ano A</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Matemática</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">32 alunos</p>
              <p className="text-sm text-gray-600">Turno: Matutino</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">8º Ano B</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Matemática</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">28 alunos</p>
              <p className="text-sm text-gray-600">Turno: Vespertino</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">9º Ano C</h3>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Matemática</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">30 alunos</p>
              <p className="text-sm text-gray-600">Turno: Matutino</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aulas Ministradas</p>
                  <p className="text-2xl font-bold text-gray-900">142</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Notas Lançadas</p>
                  <p className="text-2xl font-bold text-gray-900">89%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Frequência Média</p>
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                </div>
                <ClipboardList className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Provas Criadas</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividades Recentes</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Aula lançada: Equações de 2º Grau</p>
                  <p className="text-xs text-gray-600">7º Ano A - Hoje às 14:30</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Chamada realizada</p>
                  <p className="text-xs text-gray-600">8º Ano B - Hoje às 10:15</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Notas do 1º Bimestre lançadas</p>
                  <p className="text-xs text-gray-600">9º Ano C - Ontem às 16:45</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;