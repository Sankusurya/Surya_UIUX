import { supabase, isSupabaseConfigured } from '../lib/supabase';

const CONTENT_TABLE = 'portfolio_content';
const MESSAGES_TABLE = 'portfolio_messages';

/**
 * Fetches all portfolio content from the online database.
 * Returns null if Supabase is unconfigured or table is empty.
 */
export const fetchCloudContent = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(CONTENT_TABLE)
      .select('key, data');

    if (error) {
      console.warn('Supabase fetch notice:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const contentMap = {};
    data.forEach((row) => {
      contentMap[row.key] = row.data;
    });

    return contentMap;
  } catch (err) {
    console.warn('Failed to load from cloud database:', err);
    return null;
  }
};

/**
 * Saves a specific section (e.g. 'projects', 'profile', 'steps') to the online database.
 */
export const saveCloudContent = async (key, data) => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      isOffline: true,
      error: 'Online database not connected. Saved to browser storage.',
    };
  }

  try {
    const { error } = await supabase
      .from(CONTENT_TABLE)
      .upsert({
        key,
        data,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return {
        success: false,
        error: `Database error saving ${key}: ${error.message}. (Did you run the SQL setup script in Supabase?)`,
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: `Network error saving to cloud: ${err.message || 'Unknown network error'}`,
    };
  }
};

/**
 * Seeds or syncs all current portfolio content to the online database.
 */
export const seedCloudDatabase = async (allData) => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      error: 'Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
    };
  }

  const keys = ['projects', 'profile', 'steps', 'principles', 'about'];
  const rows = keys
    .filter((k) => allData[k] !== undefined)
    .map((k) => ({
      key: k,
      data: allData[k],
      updated_at: new Date().toISOString(),
    }));

  try {
    const { error } = await supabase
      .from(CONTENT_TABLE)
      .upsert(rows);

    if (error) {
      return {
        success: false,
        error: `Database setup error: ${error.message}. Please check that the 'portfolio_content' table exists in Supabase.`,
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: `Failed to sync content to cloud: ${err.message || 'Unknown error'}`,
    };
  }
};

/**
 * Fetches all visitor messages from the online database.
 */
export const fetchCloudMessages = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Could not fetch cloud messages:', error.message);
      return null;
    }

    return data || [];
  } catch (err) {
    console.warn('Error fetching messages from cloud:', err);
    return null;
  }
};

/**
 * Inserts a new visitor message into the online database.
 */
export const saveCloudMessage = async (message) => {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      isOffline: true,
      error: 'Cloud database not configured. Message saved locally.',
    };
  }

  try {
    const row = {
      id: message.id || `msg-${Date.now()}`,
      name: message.name,
      email: message.email,
      topic: message.topic || 'General Inquiry',
      message: message.message,
      created_at: message.created_at || new Date().toISOString(),
      read: Boolean(message.read),
    };

    const { error } = await supabase
      .from(MESSAGES_TABLE)
      .insert([row]);

    if (error) {
      return {
        success: false,
        error: `Failed to save message to cloud: ${error.message}`,
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: `Failed to save message: ${err.message || 'Unknown network error'}`,
    };
  }
};

/**
 * Marks a message as read in the online database.
 */
export const markCloudMessageRead = async (id) => {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from(MESSAGES_TABLE).update({ read: true }).eq('id', id);
  } catch (err) {
    console.warn('Could not update message read status:', err);
  }
};

/**
 * Deletes a message from the online database.
 */
export const deleteCloudMessage = async (id) => {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from(MESSAGES_TABLE).delete().eq('id', id);
  } catch (err) {
    console.warn('Could not delete message from cloud:', err);
  }
};
