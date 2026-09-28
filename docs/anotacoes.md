# Anotações de aprendizado

Registro de conceitos novos encontrados durante o desenvolvimento, com exemplos tirados do próprio código do projeto.

## `Promise` e o executor `(resolve, reject)`

Usado em [app/index.tsx](../app/index.tsx) para simular um delay (`sleep`) dentro de `handleGoogleLogin`:

```ts
await new Promise((resolve) => setTimeout(resolve, 2000));
```

### O que é `resolve`

Toda `Promise` é criada assim:

```ts
new Promise((resolve, reject) => {
  // ...
});
```

O construtor `Promise` chama essa função (o "executor") imediatamente, passando dois argumentos:

- `resolve(valor)` — marca a Promise como cumprida (fulfilled), opcionalmente com um valor.
- `reject(erro)` — marca a Promise como rejeitada (failed), com um erro.

Um `await` (ou `.then()`) na Promise só continua depois que uma dessas duas funções é chamada.

No exemplo do projeto, como não precisamos de valor nem de erro — só esperar um tempo — passamos `resolve` direto como callback do `setTimeout`. Depois de 2000ms, `setTimeout` chama `resolve()` e a Promise é cumprida, liberando o `await`.

Isso é equivalente à versão mais explícita:

```ts
await new Promise((resolve) => {
  setTimeout(() => {
    resolve(undefined);
  }, 2000);
});
```

### Abordagem alternativa: helper `sleep`

Em vez de repetir `new Promise((resolve) => setTimeout(resolve, ms))` em cada lugar, é comum extrair um helper reutilizável:

```ts
// utils/sleep.ts
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
```

E usar assim:

```ts
await sleep(2000);
```

Vantagens: mais legível no ponto de uso, evita repetição, e fica fácil trocar a implementação depois (ex.: cancelar o timeout, usar em testes, etc.).
