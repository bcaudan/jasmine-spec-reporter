import {DisplayProcessor} from "../display-processor";
import {CustomReporterResult} from "../spec-reporter";

export class SpecColorsProcessor extends DisplayProcessor {
    public displaySuccessfulSpec(spec: CustomReporterResult, log: string): string {
        return this.theme.successful(log);
    }

    public displayFailedSpec(spec: CustomReporterResult, log: string): string {
        return this.theme.failed(log);
    }

    public displayPendingSpec(spec: CustomReporterResult, log: string): string {
        return this.theme.pending(log);
    }
}
