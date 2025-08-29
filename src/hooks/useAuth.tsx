import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Get initial session first (synchronously)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
        }
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    // Initialize auth state
    initAuth();

    // Set up auth state listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email || 'no-user');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log("SignOut called");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("SignOut error:", error);
        // Don't throw error - clear local state anyway
      }
      
      // Force clear local state regardless of server response
      setSession(null);
      setUser(null);
      
      // Clear any potential localStorage items
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-gedgcagidpheugikoyim-auth-token');
      
      // Navigate to homepage after successful logout
      window.location.href = '/';
      
      console.log("SignOut completed - local state cleared");
    } catch (error) {
      console.error("SignOut failed:", error);
      // Still clear local state even if server call fails
      setSession(null);
      setUser(null);
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-gedgcagidpheugikoyim-auth-token');
      
      // Navigate to homepage even on error
      window.location.href = '/';
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};