# Entrevista Desenvolvedor Júnior - Testes, POO e SOLID

## Testes Práticos

### 1. Testes Unitários

- O que são testes unitários e qual sua finalidade?
- Qual a diferença entre mock, stub e spy?
- Como você garantiria que um teste unitário está bem isolado?
- O que é o padrão AAA (Arrange, Act, Assert)?
- Por que é importante evitar testes que dependem de outros testes?
- Como você lidaria com dependências externas (banco de dados, API) nos testes?

### 2. Testes de Integração

- Qual a diferença entre teste unitário e teste de integração?
- Quando você utilizaria testes de integração?
- Como você configuraria um ambiente de testes para testes de integração?
- O que são testes end-to-end (E2E) e quando utilizá-los?

### 3. TDD (Test-Driven Development)

- Explique o fluxo do TDD (vermelho, verde, refatorar).
- Quais as vantagens de desenvolver orientado por testes?
- Quando você NÃO utilizaria TDD?

### 4. Práticas e Qualidade

- O que é cobertura de código? Ela garante código sem bugs?
- O que tornam um bom teste unitário?
- Como você nomearia métodos de teste para serem claros?
- O que é teste de regressão e quando aplicá-lo?

---

## Programação Orientada a Objetos (POO)

### 1. PilaresFundamentais

- O que são os 4 pilares da POO? Explique cada um.
- Qual a diferença entre encapsulamento e ocultamento de dados?
- Como o polimorfismo pode ser implementado em código?
- Quando você usaria uma classe abstrata vs uma interface?

### 2. Classes e Objetos

- Qual a diferença entre classe e objeto?
- O que é o princípio "favorecer composição ao invés de herança"?
- Quando herança é adequada? Quando deve ser evitada?
- O que são classes utilitárias (helpers) e por que geralmente são uma má prática?

### 3. ConceitosAvançados

- O que é coesão de classes? Por que alta coesão é desejável?
- O que é acoplamento? Como reduzi-lo?
- Explique o conceito de dependência e injeção de dependência.
- O que é o padrão de projeto Factory?

---

## SOLID

### S - Single Responsibility Principle (SRP)

- O que diz o SRP? Dê um exemplo de violação e correção.
- Como você identifica quando uma classe tem muitas responsabilidades?
- Por que "mudanças" devem ser o critério para medir responsabilidade única?

### O - Open/Closed Principle (OCP)

- O que diz o OCP?
- Como você implementaria extensão sem modificar código existente?
- Dê um exemplo prático de aplicação do OCP.

### L - Liskov Substitution Principle (LSP)

- O que diz o LSP?
- O que é uma "violação" do LSP e como evitá-la?
- Como você garantiria que subclasses são substitutas da classe pai?

### I - Interface Segregation Principle (ISP)

- O que diz o ISP?
- Por que é melhor ter interfaces pequenas e específicas?
- Dê exemplo de uma interface "gorda" e como você a refatoraria.

### D - Dependency Inversion Principle (DIP)

- O que diz o DIP?
- Qual a diferença entre dependência e injeção de dependência?
- Como o DIP facilita a troca de implementações (ex: banco de dados)?

---

## Perguntas Práticas de Código

### Exercício 1: Refatoração

```java
// Código problemático - identifique os problemas e refatore
class Usuario {
    public void salvar(Connection conn) {
        // lógica de salvamento em banco
    }
    public void enviarEmail() {
        // lógica de envio de email
    }
    public void validar() {
        // lógica de validação
    }
}
```

### Exercício 2: SOLID

```java
// Aplique os princípios SOLID
class Pedido {
    public void calcularFrete() { /* ... */ }
    public void salvarNoBanco() { /* ... */ }
    public void gerarPDF() { /* ... */ }
    public void enviarEmail() { /* ... */ }
}
```

### Exercício 3: Testes

```java
// Escreva testes unitários para esta classe
class Calculadora {
    public int somar(int a, int b) { return a + b; }
    public int dividir(int a, int b) { 
        if (b == 0) throw new ArithmeticException("Divisão por zero");
        return a / b; 
    }
}
```

---

## Dicas para Aumentar a Qualidade de uma Aplicação Backend

### Práticas de Código

- **Escreva código limpo**: nomes significativos, funções pequenas, princípio da responsabilidade única
- **Aplique SOLID**: mantenha o código extensível e fácil de manter
- **Use comentários** apenas para explicar "por que", não "o que"
- **Refatore constantemente**: código limpo é um processo contínuo

### Testes

- **Adote TDD**: escriba testes antes do código de produção
- **Mantenha alta cobertura** em regras de negócio críticas
- **Teste cenários de erro** além dos caminhos happy path
- **Automatize testes** no pipeline de CI/CD

### Arquitetura

- **Separe responsabilidades**: use camadas (controller, service, repository)
- **Aplique padrões de projeto** quando apropriados (Factory, Repository, Strategy)
- **Use injeção de dependência** para facilitar testabilidade
- **Documente decisões** técnicas (Architecture Decision Records)

### Revisão e Manutenção

- **Faça code reviews**: multidisciplina e dissemina conhecimento
- **Utilize análise estática** (SonarQube, ESLint, etc.)
- **Monitore métricas** de qualidade (complexidade ciclomática, duplicação)
- **Mantenha documentação** atualizada da API

### Boas Práticas gerais

- **Versionamento semântico** para releases
- **Logging estruturado** para debugging
- **Tratamento de exceções** adequado
- **Validação de dados** em todas as camadas
- **Segurança** desde o design (OWASP)

---

## Resources Adicionais

- Livros: "Clean Code" (Robert Martin), "Clean Architecture" (Robert Martin)
- Artigos: Martin Fowler sobre padrões de projeto
- Prática: LeetCode, Codewars para exercícios de lógica

# artigos para escrever

## Testes - Vamos escoler alguns

 -> O que são testes?
 -> Pra que e por que testar?
 -> Testes unitário x testes de integração x testes e2e
 -> Testes utilizando jest
 -> Testes utilizando cypress

## Poo

 -> Um artigo sobre programação orientada a objetos

## SOLID

 -> Um artigo sobre SOLID
