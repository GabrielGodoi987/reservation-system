# Configuração do Jest - Explicação

## O que foi configurado

### jest.config.js

```javascript
module.exports = {
  preset: "ts-jest",                    // Permite rodar TypeScript nativamente
  testEnvironment: "node",               // Ambiente de execução (node vs browser)
  testMatch: ["**/*.test.ts"],           // Padrão para encontrar arquivos de teste
  moduleFileExtensions: ["ts", "js"],    // Extensões suportadas
  transformIgnorePatterns: ["node_modules/(?!uuid)/"],
  
  // --- Novas configurações ---
  
  roots: ["<rootDir>/src", "<rootDir>/test"],   // Onde procurar por testes
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",              // Alias de import
  },
};
```

---

## Explicação das Configurações

### 1. `preset: "ts-jest"`
- Permite que o Jest entenda e execute arquivos TypeScript diretamente
- Não precisa compilar o código antes de rodar os testes
- Faz a transpilação TS → JS automaticamente

### 2. `testEnvironment: "node"`
- Define o ambiente de execução
- `node` = para testes de backend/servidor
- `jsdom` = para testes de frontend (simula um browser)

### 3. `testMatch: ["**/*.test.ts"]`
- Padrão glob para encontrar arquivos de teste
- `**/*.test.ts` = qualquer arquivo `.test.ts` em qualquer pasta
- Você também pode usar `.spec.ts` se preferir

### 4. `roots: ["<rootDir>/src", "<rootDir>/test"]`
- Define onde o Jest deve buscar por código para testar
- Agora ele procura em **duas pastas**: `src/` e `test/`
- `<rootDir>` é automaticamente substituído pelo caminho do projeto

### 5. `moduleNameMapper`
- Mapeia caminhos de import para outros caminhos
- Permite criar "aliases" para imports

```javascript
"@/(.*)": "<rootDir>/src/$1"
// @/domain/entities/user → src/domain/entities/user
```

---

## Alias `@/` - Como usar

### Antes (caminhos relativos)
```typescript
import { UserEntity } from "../../../../src/domain/entities/user/user.entity";
import { BookingService } from "../../../application/services/booking/booking.service";
```

### Depois (com alias)
```typescript
import { UserEntity } from "@/domain/entities/user/user.entity";
import { BookingService } from "@/application/services/booking/booking.service";
```

**Benefícios:**
- Imports mais curtos e legíveis
- Não precisa contar pastas `../`
- Se mover o arquivo de lugar, não precisa alterar os imports

---

## tsconfig.json - Configurações relacionadas

```json
{
  "compilerOptions": {
    "baseUrl": ".",                    // Base para resolver caminhos
    "paths": {
      "@/*": ["src/*"]                 // Mapeia @/ para src/
    }
  }
}
```

- `baseUrl` = ponto de partida para resolver módulos
- `paths` = mapeia os aliases (mesmo do Jest)
- Agora o TypeScript e o Jest entendem o `@/`

---

## Comandos Úteis

```bash
npm test                     # Roda todos os testes
npm test -- --watch         # Roda em modo watch (re-executa ao salvar)
npm test -- --coverage      # Gera relatório de cobertura de código
npm test -- --verbose       # Saída mais detalhada
npm test -- --testPathPattern=user   # Filtra por nome de arquivo
npm test -- --testNamePattern="deve" # Filtra por nome do teste
```

---

## Estrutura de Pastas Recomendada

```
projeto/
├── src/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── lib/
├── test/                    # Testes de integração e específicos
│   └── infrastructure/
│       └── repositories/
└── *.test.ts                # Testes unitários junto ao código fonte
```

- **src/\*.test.ts** = testes unitários (próximos ao código)
- **test/\*** = testes de integração, e2e, ou específicos

---

## Exemplo de arquivo de teste

```typescript
import { context } from "@/lib/context";                    // Alias
import { UserEntity } from "@/domain/entities/user/user.entity";

describe("User Entity", () => {
  context("success", () => {
    it("should create an user with valid data", () => {
      const user = new UserEntity("1", "John Doe");
      expect(user).toBeInstanceOf(UserEntity);
      expect(user.getName()).toBe("John Doe");
    });
  });

  context("failure", () => {
    it("should throw error if name is empty", () => {
      expect(() => new UserEntity("1", "")).toThrow("Name cannot be empty");
    });
  });
});
```

---

## Dica: `context` vs `describe`

O `context` é apenas um alias para `describe`. Você pode ver isso no arquivo `src/lib/context.ts`:

```typescript
export const context = describe;
```

É uma questão de semântica:
- `describe` = agrupa testes de um módulo/componente
- `context` = agrupa testes por contexto (success, failure, etc.)
