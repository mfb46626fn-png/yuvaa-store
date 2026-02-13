"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Profile = {
    id: string;
    role: "admin" | "customer";
    full_name: string | null;
    phone: string | null;
    address: string | null;
    created_at: string;
};

type AuthContextType = {
    user: User | null;
    profile: Profile | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    isLoading: true,
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Get current session
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (session?.user) {
                    setUser(session.user);
                    await fetchProfile(session.user.id);
                } else {
                    setUser(null);
                    setProfile(null);
                }
            } catch (error: any) {
                if (error.name === 'AbortError') return;
                console.error("Auth initialization error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                // If switching users or generic update, assume valid session
                if (session.user.id !== user?.id) {
                    setUser(session.user);
                    await fetchProfile(session.user.id);
                }
            } else {
                setUser(null);
                setProfile(null);
                setIsLoading(false); // Ensure loading stops on sign out
            }
        });

        initializeAuth();

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, user?.id]);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) {
                console.error("Error fetching profile:", error);
                // Trigger auto-creation if missing (fallback for manual inserts/edge cases) or just ignore
            } else {
                setProfile(data as Profile);
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        router.refresh();
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, profile, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
