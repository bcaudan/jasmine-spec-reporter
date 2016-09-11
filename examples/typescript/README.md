Use jasmine-spec-reporter with TypeScript
=========================================

## Configuration

```typescript
import { SpecReporter } from "jasmine-spec-reporter";
import { DisplayProcessor } from "jasmine-spec-reporter";

class CustomProcessor extends DisplayProcessor {
    displayJasmineStarted(info: any, log: String): String {
        return `TypeScript ${log}`;
    }
}

new SpecReporter({
    customProcessors: [CustomProcessor]
})
```

## Example

You can find an example in this directory:

    npm install
    npm start
