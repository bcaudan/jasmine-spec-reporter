export class ExecutionMetrics {
    private static pluralize(count: number): string {
        return count > 1 ? "s" : "";
    }

    public successfulSpecs: number = 0;
    public failedSpecs: number = 0;
    public pendingSpecs: number = 0;
    public skippedSpecs: number = 0;
    public totalSpecsDefined: number = 0;
    public executedSpecs: number = 0;
    public duration: string;
    public random: boolean = false;
    public seed: number;

    private startTime: number;
    private specStartTime: number;

    public start(info: any): void {
        this.startTime = (new Date()).getTime();
        this.totalSpecsDefined = info && info.totalSpecsDefined ? info.totalSpecsDefined : 0;
    }

    public stop(info: any): void {
        const totalSpecs = this.failedSpecs + this.successfulSpecs + this.pendingSpecs;
        this.duration = this.formatDuration((new Date()).getTime() - this.startTime);
        this.executedSpecs = this.failedSpecs + this.successfulSpecs;
        this.totalSpecsDefined = this.totalSpecsDefined ? this.totalSpecsDefined : totalSpecs;
        this.skippedSpecs = this.totalSpecsDefined - totalSpecs;
        this.random = info && info.order && info.order.random;
        this.seed = info && info.order && info.order.seed;
    }

    public startSpec(): void {
        this.specStartTime = (new Date()).getTime();
    }

    public stopSpec(spec: any): void {
        spec.duration = this.formatDuration((new Date()).getTime() - this.specStartTime);
    }

    private formatDuration(durationInMs: number): string {
        let duration: string = "";
        let durationInSecs: number = durationInMs / 1000;
        let durationInMins: number;
        let durationInHrs: number;
        if (durationInSecs < 1) {
            return `${durationInSecs} sec${ExecutionMetrics.pluralize(durationInSecs)}`;
        }
        durationInSecs = Math.round(durationInSecs);
        if (durationInSecs < 60) {
            return `${durationInSecs} sec${ExecutionMetrics.pluralize(durationInSecs)}`;
        }
        durationInMins = Math.floor(durationInSecs / 60);
        durationInSecs = durationInSecs % 60;
        if (durationInSecs) {
            duration = ` ${durationInSecs} sec${ExecutionMetrics.pluralize(durationInSecs)}`;
        }
        if (durationInMins < 60) {
            return `${durationInMins} min${ExecutionMetrics.pluralize(durationInMins)}${duration}`;
        }
        durationInHrs = Math.floor(durationInMins / 60);
        durationInMins = durationInMins % 60;
        if (durationInMins) {
            duration = ` ${durationInMins} min${ExecutionMetrics.pluralize(durationInMins)}${duration}`;
        }
        return `${durationInHrs} hour${ExecutionMetrics.pluralize(durationInHrs)}${duration}`;
    }
}
