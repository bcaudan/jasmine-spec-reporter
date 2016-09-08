import {DisplayProcessor} from '../display-processor';

export class SpecDurationsProcessor extends DisplayProcessor {
    displaySuccessfulSpec(spec: any, log: String): String {
        return this.displayDuration(spec, log);
    }

    displayFailedSpec(spec: any, log: String): String {
        return this.displayDuration(spec, log);
    }

    private displayDuration(spec: any, log: String): String {
        return log + ' (' + spec.duration + ')';
    }
}
