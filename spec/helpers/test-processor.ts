import { DisplayProcessor } from "../../built/main";

export class TestProcessor extends DisplayProcessor {
    private test: string;

    constructor(configuration?: any) {
        super(configuration);
        this.test = configuration.customOptions.test;
    }

    displayJasmineStarted(info: any, log: String): String {
        return log + this.test;
    }

    displaySuite(suite: any, log: String): String {
        return log + this.test;
    }

    displaySpecStarted(spec: any, log: String): String {
        return spec.description + this.test;
    }

    displaySuccessfulSpec(spec: any, log: String): String {
        return log + this.test;
    }

    displayFailedSpec(spec: any, log: String): String {
        return log + this.test;
    }

    displayPendingSpec(spec: any, log: String): String {
        return log + this.test;
    }
}
