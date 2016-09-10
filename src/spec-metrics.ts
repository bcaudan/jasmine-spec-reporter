export class SpecMetrics {
    private startTime: number;
    private specStartTime: number;
    private totalSpecs: number = 0;

    successfulSpecs: number = 0;
    failedSpecs: number = 0;
    pendingSpecs: number = 0;
    skippedSpecs: number = 0;

    totalSpecsDefined: number = 0;
    executedSpecs: number = 0;
    duration: string;
    random: boolean = false;
    seed: number;

    start(info: any): void {
        this.startTime = (new Date()).getTime();
        this.totalSpecsDefined = info && info.totalSpecsDefined ? info.totalSpecsDefined : 0;
    }

    stop(info: any): void {
        this.duration = this.formatDuration((new Date()).getTime() - this.startTime);
        this.totalSpecs = this.failedSpecs + this.successfulSpecs + this.pendingSpecs;
        this.executedSpecs = this.failedSpecs + this.successfulSpecs;
        this.totalSpecsDefined = this.totalSpecsDefined ? this.totalSpecsDefined : this.totalSpecs;
        this.skippedSpecs = this.totalSpecsDefined - this.totalSpecs;
        this.random = info && info.order && info.order.random;
        this.seed = info && info.order && info.order.seed;
    }

    startSpec(): void {
        this.specStartTime = (new Date()).getTime();
    }

    stopSpec(spec: any): void {
        spec.duration = this.formatDuration((new Date()).getTime() - this.specStartTime);
    }

    formatDuration(durationInMs: number): string {
        let duration: string = "";
        let durationInSecs: number = durationInMs / 1000;
        let durationInMins: number;
        let durationInHrs: number;
        if (durationInSecs < 1) {
            return `${durationInSecs} sec${SpecMetrics.pluralize(durationInSecs)}`;
        }
        durationInSecs = Math.round(durationInSecs);
        if (durationInSecs < 60) {
            return `${durationInSecs} sec${SpecMetrics.pluralize(durationInSecs)}`;
        }
        durationInMins = Math.floor(durationInSecs / 60);
        durationInSecs = durationInSecs % 60;
        if (durationInSecs) {
            duration = ` ${durationInSecs} sec${SpecMetrics.pluralize(durationInSecs)}`;
        }
        if (durationInMins < 60) {
            return `${durationInMins} min${SpecMetrics.pluralize(durationInMins)}${duration}`;
        }
        durationInHrs = Math.floor(durationInMins / 60);
        durationInMins = durationInMins % 60;
        if (durationInMins) {
            duration = ` ${durationInMins} min${SpecMetrics.pluralize(durationInMins)}${duration}`;
        }
        return `${durationInHrs} hour${SpecMetrics.pluralize(durationInHrs)}${duration}`;
    }

    private static pluralize(count: number): string {
        return count > 1 ? "s" : "";
    }
}
