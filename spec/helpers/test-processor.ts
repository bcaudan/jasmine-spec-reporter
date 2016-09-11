import { DisplayProcessor } from "../../built/main";

export class TestProcessor extends DisplayProcessor {
    private test: string;

    constructor(protected options: any) {
        super(options);
        this.test = options.test;
    }

    displayJasmineStarted(runner, log) {
        return log + this.test;
    }

    displaySuite(suite, log) {
        return log + this.test;
    }

    displaySpecStarted(spec, log) {
        return spec.description + this.test;
    }

    displaySuccessfulSpec(spec, log) {
        return log + this.test;
    }

    displayFailedSpec(spec, log) {
        return log + this.test;
    }

    displayPendingSpec(spec, log) {
        return log + this.test;
    }
}
