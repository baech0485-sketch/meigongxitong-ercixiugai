'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError('密码错误，请重新输入');
        return;
      }

      router.replace('/');
      router.refresh();
    } catch (loginError) {
      console.error('Login error:', loginError);
      setError('登录失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f3ed] px-4 py-10">
      <div className="w-full max-w-[420px] rounded-[28px] border border-[#e8e0d6] bg-white p-7 shadow-[0_18px_44px_rgba(23,18,8,0.08)]">
        <div className="mb-7 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#242930] text-white">
            <LockKeyhole className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-[#242930]">系统登录</h1>
            <p className="mt-1 text-sm text-[#737580]">美工图片二次调整系统</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#242930]" htmlFor="password">
              登录密码
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-[16px] border-[#e5e0d6] bg-[#fbfaf7] px-4 text-base"
              placeholder="请输入密码"
            />
          </div>

          {error && (
            <div className="rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={!password || isSubmitting}
            className="h-12 w-full rounded-[16px] bg-[#ed782b] text-base font-bold text-white hover:bg-[#dc6b24]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                登录中
              </>
            ) : (
              '进入系统'
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
