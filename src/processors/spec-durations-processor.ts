import { DisplayProcessor } from "../display-processor";

export class SpecDurationsProcessor extends DisplayProcessor {
    displaySuccessfulSpec(spec: any, log: String): String {
        return SpecDurationsProcessor.displayDuration(spec, log);
    }

    displayFailedSpec(spec: any, log: String): String {
        return SpecDurationsProcessor.displayDuration(spec, log);
    }

    private static displayDuration(spec: any, log: String): String {
        return `${log} (${spec.duration})`;
    }
}
