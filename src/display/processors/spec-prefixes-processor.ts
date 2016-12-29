import { DisplayProcessor } from "../display-processor";
import { Configuration } from "../../configuration";

export class SpecPrefixesProcessor extends DisplayProcessor {
    constructor(private configuration: Configuration) {
        super(configuration);
    }

    displaySuccessfulSpec(spec: any, log: String): String {
        return this.configuration.prefixes.successful + log;
    }

    displayFailedSpec(spec: any, log: String): String {
        return this.configuration.prefixes.failed + log;
    }

    displayPendingSpec(spec: any, log: String): String {
        return this.configuration.prefixes.pending + log;
    }
}
