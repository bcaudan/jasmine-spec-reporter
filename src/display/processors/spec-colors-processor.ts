import { DisplayProcessor } from "../display-processor";

export class SpecColorsProcessor extends DisplayProcessor {
    displaySuccessfulSpec(spec: any, log: String): String {
        return log.successful;
    }

    displayFailedSpec(spec: any, log: String): String {
        return log.failed;
    }

    displayPendingSpec(spec: any, log: String): String {
        return log.pending;
    }
}
