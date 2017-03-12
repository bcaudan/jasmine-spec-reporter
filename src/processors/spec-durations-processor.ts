import {DisplayProcessor} from "../display-processor";
import {CustomReporterResult} from "../spec-reporter";

export class SpecDurationsProcessor extends DisplayProcessor {
    private static displayDuration(spec: CustomReporterResult, log: String): String {
        return `${log} (${spec.duration})`;
    }

    public displaySuccessfulSpec(spec: CustomReporterResult, log: String): String {
        return SpecDurationsProcessor.displayDuration(spec, log);
    }

    public displayFailedSpec(spec: CustomReporterResult, log: String): String {
        return SpecDurationsProcessor.displayDuration(spec, log);
    }
}
