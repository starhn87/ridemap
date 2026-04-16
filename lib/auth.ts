import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';
import type { Provider } from '@supabase/supabase-js';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri({ scheme: 'ridemap' });

async function signInWithProvider(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (data.url) {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
    if (result.type === 'success' && result.url) {
      const url = new URL(result.url);
      const params = new URLSearchParams(url.hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }
    }
  }
}

export const signInWithKakao = () => signInWithProvider('kakao');
export const signInWithApple = () => signInWithProvider('apple');
export const signInWithGoogle = () => signInWithProvider('google');
export const signInWithNaver = () => signInWithProvider('naver' as Provider);
