import { auth } from "@/firebase-config";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useState } from "react";

/**
 * Versão NATIVA (Android/iOS) do login com Google.
 *
 * O Metro escolhe este arquivo no lugar de `use-google-auth.ts` quando o app
 * roda em iOS/Android (extensão `.native.ts`). Na web continua valendo o
 * `use-google-auth.ts`. As telas importam sempre "@/hooks/use-google-auth" e
 * recebem a mesma assinatura: { request, promptAsync, error }.
 *
 * Por que não dá pra usar o mesmo fluxo da web aqui?
 * O fluxo da web (expo-auth-session) abre um navegador e volta por um
 * redirect URI. O Google NÃO aceita redirect pra scheme de app (fasipe:// ou
 * exp://) com Client ID do tipo "Web" — daí o erro redirect_uri_mismatch.
 * No celular o caminho certo é o login NATIVO do Google (tela do sistema,
 * sem navegador, sem redirect), que exige um development build (não roda no
 * Expo Go).
 */

// `webClientId` é o MESMO Client ID "Web" usado na web. Ele não serve pra abrir
// o login — serve pro Google saber PARA QUEM emitir o idToken. É esse idToken
// que o Firebase valida. Sem ele, o signIn() volta sem idToken.
//
// Importante: no Android o app também precisa de um Client ID do tipo "Android"
// criado no Google Cloud (package name + SHA-1). Ele NÃO é passado aqui: o
// Google identifica o app pelo package/SHA-1 sozinho. Se faltar, o login falha
// com DEVELOPER_ERROR.
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export function useGoogleAuth() {
  // Mesma ideia do `error` da versão web: texto do último erro (ou null).
  const [error, setError] = useState<string | null>(null);

  /**
   * Abre a tela nativa de escolha de conta do Google e, se o usuário
   * confirmar, entrega o idToken ao Firebase.
   */
  async function promptAsync() {
    setError(null);
    try {
      // Android: confere se o Google Play Services está disponível/atualizado.
      // (No iOS retorna true direto.) Se não estiver, abre o diálogo de update.
      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();

      // O usuário fechou a tela sem escolher conta: não é erro, só ignoramos.
      if (response.type !== "success") return;

      const idToken = response.data.idToken;
      if (!idToken) {
        setError("O Google não devolveu o idToken. Confira o webClientId.");
        return;
      }

      // Igual à versão web: troca o idToken do Google por uma credencial do
      // Firebase e loga. Isso dispara o onAuthStateChanged no AuthProvider,
      // que atualiza o `user` global e a tela navega pro mapa.
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao logar com o Google");
    }
  }

  // `request` na web indica "client id carregado, pode clicar". Aqui não há
  // carregamento, então devolvemos true pra manter o contrato das telas.
  return { request: true as const, promptAsync, error };
}
