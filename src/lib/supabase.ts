import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase Environment Variables. Please check your .env file.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
)

// Helper to log admin activities
export const logActivity = async (action: string, details: string, severity: 'info' | 'warning' | 'success' = 'info') => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('audit_logs')
    .insert([
      { 
        admin_id: user.id, 
        admin_email: user.email, 
        action, 
        details, 
        severity 
      }
    ]);

  if (error) console.error('Error logging activity:', error);
};
