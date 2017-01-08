import { DisplayProcessor } from "../display-processor";

export class SpecColorsProcessor extends DisplayProcessor {
    public displaySuccessfulSpec(spec: any, log: String): String {
        return log.successful;
    }

    public displayFailedSpec(spec: any, log: String): String {
        return log.failed;
    }

    public displayPendingSpec(spec: any, log: String): String {
        return log.pending;
    }
}
