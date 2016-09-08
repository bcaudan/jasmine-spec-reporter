import {DisplayProcessor} from '../display-processor';

export class SpecColorsProcessor extends DisplayProcessor {
    displaySuccessfulSpec(spec: any, log: String): String {
        return log.success;
    }

    displayFailedSpec(spec: any, log: String): String {
        return log.failure;
    }

    displayPendingSpec(spec: any, log: String): String {
        return log.pending;
    }
}
