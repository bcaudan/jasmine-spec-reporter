import { DisplayProcessor } from "../display-processor";

export class DefaultProcessor extends DisplayProcessor {
    displayJasmineStarted(): String {
        return "Spec started";
    }

    displaySuite(suite: any): String {
        return suite.description;
    }

    displaySuccessfulSpec(spec: any): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    displayFailedSpec(spec: any): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    displayPendingSpec(spec: any): String {
        return DefaultProcessor.displaySpecDescription(spec);
    }

    private static displaySpecDescription(spec: any): String {
        return spec.description;
    }
}
