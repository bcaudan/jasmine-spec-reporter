import { CustomReporterResult } from "../../custom-reporter-result";
import { DisplayProcessor } from "../display-processor";

export class SpecColorsProcessor extends DisplayProcessor {
    public displaySuccessfulSpec(spec: CustomReporterResult, log: String): String {
        return log.successful;
    }

    public displayFailedSpec(spec: CustomReporterResult, log: String): String {
        return log.failed;
    }

    public displayPendingSpec(spec: CustomReporterResult, log: String): String {
        return log.pending;
    }
}
