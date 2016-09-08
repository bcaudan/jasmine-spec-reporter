export class DisplayProcessor {
    constructor(protected options?: any){}

    displayJasmineStarted(info, log) {
        return log;
    }

    displaySuite(suite, log) {
        return log;
    }

    displaySpecStarted(spec, log) {
        return log;
    }

    displaySuccessfulSpec(spec, log) {
        return log;
    }

    displayFailedSpec(spec, log) {
        return log;
    }

    displayPendingSpec(spec, log) {
        return log;
    }
}
