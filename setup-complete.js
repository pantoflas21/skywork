// ============================================================================
// ALETHEIA - Setup Completo Automatizado
// ============================================================================
// Este script cria o Super Admin e toda a estrutura de dados de teste
// usando a Service Role Key do Supabase
// ============================================================================

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com Service Role Key (admin)
const supabaseUrl = 'https://dhwtumzkroveaijsrarg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRod3R1bXprcm92ZWFpanNyYXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM3MDA5MSwiZXhwIjoyMDg0OTQ2MDkxfQ.6Ig3Y5-o'; // Service Role Key

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// ============================================================================
// Função para criar Super Admin
// ============================================================================
async function createSuperAdmin() {
  console.log('\n📋 Passo 1: Criando Super Admin...');
  
  try {
    // Criar usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'superadmin@aletheia.com',
      password: 'Super@123456',
      email_confirm: true,
      user_metadata: {
        full_name: 'Super Administrador',
        role: 'super_admin'
      }
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário no Auth:', authError.message);
      return null;
    }

    console.log('✅ Usuário criado no Auth:', authData.user.id);

    // Inserir na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'superadmin@aletheia.com',
        full_name: 'Super Administrador',
        role: 'super_admin',
        active: true
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Erro ao inserir na tabela users:', userError.message);
      return null;
    }

    console.log('✅ Super Admin criado com sucesso!');
    console.log('   Email: superadmin@aletheia.com');
    console.log('   Senha: Super@123456');
    
    return userData;
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    return null;
  }
}

// ============================================================================
// Função principal
// ============================================================================
async function main() {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║  ALETHEIA - Setup Automático                  ║');
  console.log('╚════════════════════════════════════════════════╝');
  
  // Verificar se já existe Super Admin
  console.log('\n🔍 Verificando se já existe Super Admin...');
  const { data: existingUsers, error: checkError } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'super_admin')
    .limit(1);

  if (checkError) {
    console.error('❌ Erro ao verificar usuários:', checkError.message);
    process.exit(1);
  }

  if (existingUsers && existingUsers.length > 0) {
    console.log('✅ Super Admin já existe!');
    console.log('   Email:', existingUsers[0].email);
    console.log('   Nome:', existingUsers[0].full_name);
  } else {
    console.log('ℹ️  Nenhum Super Admin encontrado. Criando...');
    const superAdmin = await createSuperAdmin();
    
    if (!superAdmin) {
      console.error('\n❌ Falha ao criar Super Admin!');
      process.exit(1);
    }
  }

  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║  ✅ SETUP CONCLUÍDO COM SUCESSO!              ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('\n🌐 Acesse: http://localhost:8080/#/login');
  console.log('📧 Email: superadmin@aletheia.com');
  console.log('🔑 Senha: Super@123456\n');
}

// Executar
main().catch(console.error);
