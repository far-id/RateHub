'use client';

import { useEffect, useState, useCallback } from "react";
import { RatesResponse } from "@/types/rates";

const LOCAL_KEY = "ratehub:rates:v1";

export function useRates() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [meta, setMeta] = useState<{
    time_last_update_unix?: number;
    time_next_update_unix?: number;
    base_code?: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const readCache = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as RatesResponse & { savedAt?: number };
      return parsed;
    } catch {
      return null;
    }
  }, []);

  const saveCache = useCallback((payload: RatesResponse) => {
    try {
      const toSave = { ...payload, savedAt: Math.floor(Date.now() / 1000) };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(toSave));
    } catch {
      // ignore localStorage errors (quota/security)
    }
  }, []);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rates");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = (await res.json()) as RatesResponse;
      if (data?.conversion_rates) {
        setRates(data.conversion_rates);
        setMeta({
          time_last_update_unix: data.time_last_update_unix,
          time_next_update_unix: data.time_next_update_unix,
          base_code: data.base_code,
        });
        saveCache(data);
      } else {
        throw new Error("Invalid payload from /api/rates");
      }
    } catch (e: any) {
      setError(String(e?.message ?? e));
      // fallback to cache if present
      const cached = readCache();
      if (cached?.conversion_rates) {
        setRates(cached.conversion_rates);
        setMeta({
          time_last_update_unix: cached.time_last_update_unix,
          time_next_update_unix: cached.time_next_update_unix,
          base_code: cached.base_code,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [readCache, saveCache]);

  useEffect(() => {
    // On mount, try local cache first
    setLoading(true);
    try {
      const cached = readCache();
      const now = Math.floor(Date.now() / 1000);
      if (cached && cached.conversion_rates) {
        // if cache still valid (now < time_next_update_unix) -> use it
        if (cached.time_next_update_unix && now < cached.time_next_update_unix) {
          setRates(cached.conversion_rates);
          setMeta({
            time_last_update_unix: cached.time_last_update_unix,
            time_next_update_unix: cached.time_next_update_unix,
            base_code: cached.base_code,
          });
          setLoading(false);
          // but we can optionally do a background refresh if close to next update (not necessary)
          return;
        }
      }
      // otherwise fetch fresh
      fetchRates();
    } catch (e) {
      console.log("Error reading rates from cache:", e);
      // fallback to fetch
      fetchRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(() => {
    return fetchRates();
  }, [fetchRates]);

  return { rates, meta, loading, error, refresh };
}
