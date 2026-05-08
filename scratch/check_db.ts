import { supabase } from './src/lib/supabase.ts';

async function checkAdminProfile() {
  console.log("Checking Supabase connection...");
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error("Auth Error: No user logged in or session expired.");
    return;
  }
  
  console.log("Logged in as:", user.email, "ID:", user.id);

  console.log("Attempting to fetch from admin_profiles...");
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .eq('id', user.id);

  if (error) {
    console.error("Table Error:", error.message);
    if (error.message.includes("does not exist")) {
      console.log("CRITICAL: 'admin_profiles' table is missing in Supabase.");
    }
  } else {
    console.log("Data found:", data);
    if (data.length === 0) {
      console.warn("WARNING: No entry found for this user in 'admin_profiles'.");
    }
  }
}

checkAdminProfile();
