import { auth } from "@/firebase-config";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect, useState } from "react";

// Necessário para o popup/browser de login fechar e devolver o resultado pro app.
WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  // `request` só fica pronto depois que o clientId é carregado; `response` é o
  // resultado do login (sucesso, erro ou cancelado) depois que o usuário interage.
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // Mesmo client ID pra web/Android/iOS por enquanto (webClientId funciona nos 3
    // no Expo Go/web; se um dia gerar build nativa, aí sim precisa de
    // iosClientId/androidClientId próprios cadastrados no Google Cloud).
    clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  // Erro do próprio login com o Google (ex: usuário cancelou, client id errado).
  const [error, setError] = useState<string | null>(null);

  // TEMPORÁRIO: mostra no terminal a redirect URI exata que está sendo usada,
  // pra cadastrar certinho em Authorized redirect URIs / JavaScript origins
  // no Google Cloud Console. Pode remover depois de resolver o redirect_uri_mismatch.
  useEffect(() => {
    if (request?.redirectUri) {
      console.log("Google OAuth redirectUri:", request.redirectUri);
    }
  }, [request?.redirectUri]);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      // Troca o id_token do Google por uma credencial que o Firebase entende,
      // e loga o usuário no Firebase Auth. Isso é o que dispara o
      // onAuthStateChanged no AuthProvider e atualiza o `user` global.
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((err) => {
        setError(err.message);
      });
    } else if (response?.type === "error") {
      setError(response.error?.message ?? "Erro ao logar com o Google");
    }
  }, [response]);

  return { request, promptAsync, error };
}
