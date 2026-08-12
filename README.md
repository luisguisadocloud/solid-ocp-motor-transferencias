# OCP aplicado a un servicio de transferencias

Código de ejemplo del artículo **[Principios SOLID: OCP – Principio Abierto/Cerrado](https://blog.luisguisado.cloud/principios-solid-ocp-principio-abierto-cerrado/)**, segundo de una serie de 5 publicaciones que recorren los principios **SOLID** usando un mismo ejemplo: un servicio sencillo de procesamiento de transferencias escrito en TypeScript. Este repo parte del resultado del artículo anterior (SRP ya aplicado) y se enfoca en un único colaborador, `FeeCalculator`, para mostrar qué significa estar "abierto a extensión, cerrado a modificación".

El repo contrasta dos estados del mismo caso de uso:

- **`src/before/`** - `TransferService` ya tiene SRP aplicado (validación, antifraude, persistencia y notificación viven en colaboradores separados), pero `FeeCalculator` resuelve la comisión con una cadena de `if/else` por `TransferType`. Agregar un nuevo tipo de transferencia obliga a modificar esa clase (violación de OCP).
- **`src/after/`** - `FeeCalculator` delega en una lista de `FeeStrategy` (una por tipo de transferencia). Agregar soporte para billeteras digitales (`DigitalWalletFeeStrategy`) es una clase nueva: ni `FeeCalculator` ni las estrategias existentes se tocan.

## Stack

- TypeScript 5.4
- Jest + ts-jest para los tests
- ESLint con `@typescript-eslint`
- Node.js >= 24

## Cómo ejecutarlo

Todos los comandos corren desde `src/`:

```bash
cd src
npm install      # o: yarn install
```

### Tests

```bash
npm test               # corre toda la suite
npm run test:before    # solo el caso "before" (if/else cerrado a extensión)
npm run test:after     # solo el caso "after" (con OCP aplicado)
```

### Type-check y lint

```bash
npm run build    # tsc --noEmit (solo verifica tipos, no emite JS)
npm run lint     # eslint sobre before/, after/ y tests/
```

## Estructura

```
src/
├── before/                       # FeeCalculator cerrado a extensión (if/else)
│   ├── transfer.service.ts       # orquestador
│   ├── transfer-validator.ts
│   ├── fee-calculator.ts
│   ├── fraud-checker.ts
│   ├── transfer-repository.ts
│   └── transfer-notifier.ts
├── after/                         # FeeCalculator abierto a extensión (Strategy)
│   ├── transfer.service.ts
│   ├── fee-strategy.ts           # FeeCalculator + estrategias base
│   ├── digital-wallet-fee-strategy.ts  # extensión sin tocar código existente
│   ├── transfer-validator.ts
│   ├── fraud-checker.ts
│   ├── transfer-repository.ts
│   └── transfer-notifier.ts
└── tests/
    ├── before.test.ts
    └── after.test.ts
```

## Serie SOLID

Este es el segundo artículo de una serie de 5 sobre los principios SOLID, todos apoyados en el mismo ejemplo del servicio de transferencias:

1. **S - SRP** · Single Responsibility Principle
2. **O - OCP** · Open/Closed Principle (este repo)
3. **L - LSP** · Liskov Substitution Principle
4. **I - ISP** · Interface Segregation Principle
5. **D - DIP** · Dependency Inversion Principle

## Autor

**Luis Guisado**

- Blog: [blog.luisguisado.cloud](https://blog.luisguisado.cloud)
- Artículo origen: [Principios SOLID: OCP – Principio Abierto/Cerrado](https://blog.luisguisado.cloud/principios-solid-ocp-principio-abierto-cerrado/)
