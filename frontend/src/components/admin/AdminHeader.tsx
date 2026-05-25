'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminHeader() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email || null);
    });
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/admin/login');
  };

  return (
    <header className="h-16 bg-dark-100 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile title */}
        <span className="md:hidden font-bold font-[family-name:var(--font-poppins)] text-white tracking-wide">
          ILEYA FEST ADMIN
        </span>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {email && (
          <span className="text-sm text-zinc-400 hidden sm:inline-block">
            {email}
          </span>
        )}
        <div className="w-px h-6 bg-white/10 hidden sm:block" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
