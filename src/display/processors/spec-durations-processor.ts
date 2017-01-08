import { DisplayProcessor } from "../display-processor";

export class SpecDurationsProcessor extends DisplayProcessor {
    private static displayDuration(spec: any, log: String): String {
        return `${log} (${spec.duration})`;
    }

    public displaySuccessfulSpec(spec: any, log: String): String {
        return SpecDurationsProcessor.displayDuration(spec, log);
    }

    public displayFailedSpec(spec: any, log: String): String {
        return SpecDurationsProcessor.displayDuration(spec, log);
    }
}
