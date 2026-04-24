import { useEffect } from "react";

import { getStoredSession, mapSessionToUser } from "../lib/auth";
import { getCurrentLocalUser } from "../lib/localAuth";
import { supabase } from "../lib/supabase";
import { useAppStore } from "../store/useAppStore";

export function useBootstrap() {
  const setUser = useAppStore((state) => state.setUser);
  const setAuthReady = useAppStore((state) => state.setAuthReady);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const localUser = await getCurrentLocalUser();
      const session = localUser ? null : await getStoredSession();
      if (!mounted) {
        return;
      }

      setUser(localUser ?? mapSessionToUser(session));
      setAuthReady(true);
    }

    bootstrap();

    if (!supabase) {
      return () => {
        mounted = false;
      };
    }

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const localUser = await getCurrentLocalUser();
      if (!mounted) {
        return;
      }

      setUser(localUser ?? mapSessionToUser(session));
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [setAuthReady, setUser]);
}
