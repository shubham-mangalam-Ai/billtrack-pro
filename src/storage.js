import { supabase } from "./supabaseClient";

// Drop-in replacement for the claude.ai artifact `window.storage` API,
// backed by a single `kv_store` table in Supabase.
// - shared=false (default): scoped to the logged-in user (owner = auth.uid())
// - shared=true: visible to every logged-in user

async function currentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) throw new Error("Not authenticated");
  return data.user.id;
}

function scopeKey(key, shared, ownerId) {
  return shared ? `shared:${key}` : `${ownerId}:${key}`;
}

export const storage = {
  async get(key, shared = false) {
    try {
      const ownerId = shared ? null : await currentUserId();
      const scope_key = scopeKey(key, shared, ownerId);
      const { data, error } = await supabase
        .from("kv_store")
        .select("value, shared")
        .eq("scope_key", scope_key)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return { key, value: data.value, shared: data.shared };
    } catch (e) {
      throw e;
    }
  },

  async set(key, value, shared = false) {
    const ownerId = shared ? null : await currentUserId();
    const scope_key = scopeKey(key, shared, ownerId);
    const { error } = await supabase.from("kv_store").upsert({
      scope_key,
      key,
      shared,
      owner: ownerId,
      value,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    return { key, value, shared };
  },

  async delete(key, shared = false) {
    const ownerId = shared ? null : await currentUserId();
    const scope_key = scopeKey(key, shared, ownerId);
    const { error, count } = await supabase
      .from("kv_store")
      .delete({ count: "exact" })
      .eq("scope_key", scope_key);
    if (error) throw error;
    return { key, deleted: (count || 0) > 0, shared };
  },

  async list(prefix = "", shared = false) {
    const ownerId = shared ? null : await currentUserId();
    const query = supabase.from("kv_store").select("key");
    const filtered = shared
      ? query.eq("shared", true)
      : query.eq("shared", false).eq("owner", ownerId);
    const { data, error } = await filtered.ilike("key", `${prefix}%`);
    if (error) throw error;
    return { keys: (data || []).map((r) => r.key), prefix, shared };
  },
};
