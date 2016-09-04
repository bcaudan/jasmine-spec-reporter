import {DisplayProcessor} from '../display-processor';

export class SpecDurationsProcessor extends DisplayProcessor {
    displaySuccessfulSpec(spec, log) {
        return this.displayDuration(spec, log)
    }

    displayFailedSpec(spec, log) {
        return this.displayDuration(spec, log)
    }

    private displayDuration(spec, log) {
        return log + ' (' + spec.duration + ')';
    }
}
