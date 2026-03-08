# 📌 Regras de Negócio — Sistema de Reservas

Este documento descreve as principais regras de negócio implementadas no sistema de reservas, incluindo criação, cancelamento e validações relacionadas às propriedades e hóspedes.

---

## 1️⃣ Realizar Reservas

O usuário pode reservar uma propriedade para um período específico, desde que todas as regras abaixo sejam atendidas:

### ✅ Regras para criação de reserva

- A propriedade **deve estar disponível** no período solicitado.
- O número de hóspedes **não pode exceder** a capacidade máxima da propriedade.

### 💰 Cálculo do valor da reserva

O sistema calcula automaticamente o valor total da reserva com base em:

- Um disconto de 10% para reservas de 7 noites ou mais

- **Preço por noite** da propriedade
- **Número de noites** reservadas

> **Fórmula aplicada:**  
> `valor_total = preço_por_noite × número_de_noites`

---

## 2️⃣ Cancelar Reservas

O sistema permite o cancelamento de reservas respeitando as seguintes políticas:

### 📅 Política de Cancelamento

| Período antes do check-in | Política de Reembolso   |
| ------------------------- | ----------------------- |
| Mais de 7 dias            | Reembolso total (100%)  |
| Entre 1 e 7 dias          | Reembolso parcial (50%) |
| Menos de 1 dia            | Sem reembolso           |

### 🔄 Regras de Cancelamento

- Ao cancelar uma reserva:
  - O status é atualizado para **`CANCELED`**
  - O período é liberado para novas reservas

- O sistema **impede o cancelamento** de reservas que já estejam com status `CANCELED`, retornando uma mensagem de erro apropriada ao usuário.

---

## 3️⃣ Validação do Número de Hóspedes

O sistema valida automaticamente o número de hóspedes antes de confirmar a reserva.

### 📌 Critérios de Validação

- O número de hóspedes deve ser:
  - **Maior que zero**
  - **Menor ou igual à capacidade máxima** da propriedade

### ❌ Tratamento de Erros

Reservas que não atendem a esses critérios:

- São **rejeitadas**
- Retornam **mensagens de erro claras e apropriadas** ao usuário

---

## 🎯 Objetivo das Regras

Essas regras garantem:

- Consistência de dados
- Integridade das reservas
- Experiência previsível para o usuário
- Segurança no fluxo de cancelamento e reembolso

---
