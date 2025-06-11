import supabase from './supabaseClient';

/**
 * Fetch a user's profile from Supabase
 * @param {string} userId - The user's ID from auth
 * @returns {Promise<Object>} The user profile or null if not found
 */
export async function getUserProfile(userId) {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

/**
 * Create or update a user profile
 * @param {Object} profile - The profile data to upsert
 * @returns {Promise<Object>} The updated profile or null on error
 */
export async function upsertUserProfile(profile) {
  if (!profile || !profile.user_id) {
    console.error('Invalid profile data for upsert');
    return null;
  }
  
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert([profile], { 
      onConflict: 'user_id',
      returning: 'representation'
    });
    
  if (error) {
    console.error('Error upserting user profile:', error);
    return null;
  }
  
  return data?.[0] || null;
}

/**
 * Update a user's credits
 * @param {string} userId - The user's ID
 * @param {number} credits - The new credit balance
 * @returns {Promise<boolean>} Success status
 */
export async function updateUserCredits(userId, credits) {
  if (!userId) return false;
  
  const { data, error } = await supabase
    .from('user_profiles')
    .update({ 
      credits: credits,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error updating user credits:', error);
    return false;
  }
  
  return true;
}

/**
 * Deduct credits from a user's account
 * @param {string} userId - The user's ID
 * @param {number} amount - The amount to deduct
 * @returns {Promise<boolean>} Success status
 */
export async function deductUserCredits(userId, amount) {
  if (!userId || amount <= 0) return false;
  
  // First get current credits
  const { data: profile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('credits')
    .eq('user_id', userId)
    .single();
    
  if (fetchError || !profile) {
    console.error('Error fetching current credits:', fetchError);
    return false;
  }
  
  // Check if user has enough credits
  if (profile.credits < amount) {
    return false;
  }
  
  // Update with new balance
  const newBalance = profile.credits - amount;
  return await updateUserCredits(userId, newBalance);
}

/**
 * Add credits to a user's account
 * @param {string} userId - The user's ID
 * @param {number} amount - The amount to add
 * @returns {Promise<boolean>} Success status
 */
export async function addUserCredits(userId, amount) {
  if (!userId || amount <= 0) return false;
  
  // First get current credits
  const { data: profile, error: fetchError } = await supabase
    .from('user_profiles')
    .select('credits')
    .eq('user_id', userId)
    .single();
    
  if (fetchError) {
    console.error('Error fetching current credits:', fetchError);
    return false;
  }
  
  // If profile doesn't exist yet, create it
  if (!profile) {
    const newProfile = {
      user_id: userId,
      credits: amount,
      subscription_plan: 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const result = await upsertUserProfile(newProfile);
    return !!result;
  }
  
  // Update with new balance
  const newBalance = profile.credits + amount;
  return await updateUserCredits(userId, newBalance);
}
