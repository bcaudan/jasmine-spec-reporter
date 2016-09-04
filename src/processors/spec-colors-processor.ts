import {DisplayProcessor} from '../display-processor';

export class SpecColorsProcessor extends DisplayProcessor {
    displaySuccessfulSpec(spec, log) {
        return log.success;
    }

    displayFailedSpec(spec, log) {
        return log.failure;
    }

    displayPendingSpec(spec, log) {
        return log.pending;
    }
}
