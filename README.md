# SRP aplicado a un servicio de transferencias

Código de ejemplo del artículo **[Principios SOLID: SRP – Principio de Responsabilidad Única](https://blog.luisguisado.cloud/principios-solid-srp-principio-de-responsabilidad-unica/)**, primero de una serie de 5 publicaciones que recorren los principios **SOLID** usando un mismo ejemplo: un servicio sencillo de procesamiento de transferencias escrito en TypeScript. La idea es partir de una clase escrita a propósito con malas prácticas de diseño, ver los dolores que genera y refactorizarla poco a poco.

El repo contrasta dos estados del mismo caso de uso:

- **`src/before/`** - un único `TransferService.execute()` que concentra cinco responsabilidades distintas: validación, cálculo de comisión, antifraude, persistencia y notificación. Un cambio en cualquiera de ellas obliga a tocar la misma clase (violación de SRP).
- **`src/after/`** - la misma lógica, pero con cada responsabilidad extraída en su propio colaborador (`TransferValidator`, `FeeCalculator`, `FraudChecker`, `TransferRepository`, `TransferNotifier`). El `TransferService` queda como orquestador delgado del caso de uso.

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
npm run test:before    # solo el caso "before"
npm run test:after     # solo el caso "after" (con SRP aplicado)
```

### Type-check y lint

```bash
npm run build    # tsc --noEmit (solo verifica tipos, no emite JS)
npm run lint     # eslint sobre before/, after/ y tests/
```

## Estructura

```
src/
├── before/              # versión sin SRP (todo en un método)
│   └── transfer.service.ts
├── after/               # versión con SRP (responsabilidades separadas)
│   ├── transfer.service.ts   # orquestador
│   ├── transfer-validator.ts
│   ├── fee-calculator.ts
│   ├── fraud-checker.ts
│   ├── transfer-repository.ts
│   └── transfer-notifier.ts
└── tests/
    ├── before.test.ts
    └── after.test.ts
```

## Serie SOLID

Este es el primer artículo de una serie de 5 sobre los principios SOLID, todos apoyados en el mismo ejemplo del servicio de transferencias:

1. **S - SRP** · Single Responsibility Principle (este repo)
2. **O - OCP** · Open/Closed Principle
3. **L - LSP** · Liskov Substitution Principle
4. **I - ISP** · Interface Segregation Principle
5. **D - DIP** · Dependency Inversion Principle

## Autor

**Luis Guisado**

- Blog: [blog.luisguisado.cloud](https://blog.luisguisado.cloud)
- Artículo origen: [Principios SOLID: SRP – Principio de Responsabilidad Única](https://blog.luisguisado.cloud/principios-solid-srp-principio-de-responsabilidad-unica/)

