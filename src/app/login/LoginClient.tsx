'use client';

import {useState} from 'react';
import {motion} from 'framer-motion';
import {useRouter} from 'next/navigation';
import {createBrowserSupabaseClient} from '@/utils/supabase/client';
import ThemeToggle from '@/components/ThemeToggle';

export default function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const {error: authError} = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <motion.div
        initial={{opacity: 0, y: 30, scale: 0.97}}
        animate={{opacity: 1, y: 0, scale: 1}}
        transition={{duration: 0.5, ease: 'easeOut'}}
        className="w-full max-w-md p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white">Admin Login</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to manage CCRC IT CLUB website</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black hover:bg-slate-900 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-slate-900/10 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
