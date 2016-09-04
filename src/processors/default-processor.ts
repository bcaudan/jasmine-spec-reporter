import {DisplayProcessor} from '../display-processor';

export class DefaultProcessor extends DisplayProcessor {
    displayJasmineStarted() {
        return 'Spec started';
    }

    displaySuite(suite) {
        return suite.description;
    }

    displaySuccessfulSpec(spec) {
        return this.displaySpecDescription(spec);
    }

    displayFailedSpec(spec) {
        return this.displaySpecDescription(spec);
    }

    displayPendingSpec(spec) {
        return this.displaySpecDescription(spec);
    }

    private displaySpecDescription(spec) {
        return spec.description;
    }
}
