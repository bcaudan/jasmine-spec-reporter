export class SpecMetrics {
    private startTime = null;
    private specStartTime = null;
    private duration = null;
    private executedSpecs = 0;
    private skippedSpecs = 0;
    private totalSpecs = 0;
    private totalSpecsDefined = 0;
    private random = false;
    private seed = null;

    successfulSpecs = 0;
    failedSpecs = 0;
    pendingSpecs = 0;

    start(info) {
        this.startTime = (new Date()).getTime();
        this.totalSpecsDefined = info && info.totalSpecsDefined ? info.totalSpecsDefined : 0;
    }

    stop(info) {
        this.duration = this.formatDuration((new Date()).getTime() - this.startTime);
        this.totalSpecs = this.failedSpecs + this.successfulSpecs + this.pendingSpecs;
        this.executedSpecs = this.failedSpecs + this.successfulSpecs;
        this.totalSpecsDefined = this.totalSpecsDefined ? this.totalSpecsDefined : this.totalSpecs;
        this.skippedSpecs = this.totalSpecsDefined - this.totalSpecs;
        this.random = info && info.order && info.order.random;
        this.seed = info && info.order && info.order.seed;
    }

    startSpec() {
        this.specStartTime = (new Date()).getTime();
    }

    stopSpec(spec) {
        spec.duration = this.formatDuration((new Date()).getTime() - this.specStartTime);
    }

    formatDuration(durationInMs) {
        var duration = '', durationInSecs, durationInMins, durationInHrs;
        durationInSecs = durationInMs / 1000;
        if (durationInSecs < 1) {
            return durationInSecs + ' sec' + SpecMetrics.pluralize(durationInSecs);
        }
        durationInSecs = Math.round(durationInSecs);
        if (durationInSecs < 60) {
            return durationInSecs + ' sec' + SpecMetrics.pluralize(durationInSecs);
        }
        durationInMins = Math.floor(durationInSecs / 60);
        durationInSecs = durationInSecs % 60;
        if (durationInSecs) {
            duration = ' ' + durationInSecs + ' sec' + SpecMetrics.pluralize(durationInSecs);
        }
        if (durationInMins < 60) {
            return durationInMins + ' min' + SpecMetrics.pluralize(durationInMins) + duration;
        }
        durationInHrs = Math.floor(durationInMins / 60);
        durationInMins = durationInMins % 60;
        if (durationInMins) {
            duration = ' ' + durationInMins + ' min' + SpecMetrics.pluralize(durationInMins) + duration;
        }
        return durationInHrs + ' hour' + SpecMetrics.pluralize(durationInHrs) + duration;
    }

    private static pluralize(count) {
        return count > 1 ? 's' : '';
    }
}
