import { CustomReporterResult } from "./spec-reporter";

import SuiteInfo = jasmine.SuiteInfo;
import RunDetails = jasmine.RunDetails;

export class ExecutionMetrics {
  private static pluralize(count: number): string {
    return count > 1 ? "s" : "";
  }

  public successfulSpecs = 0;
  public failedSpecs = 0;
  public pendingSpecs = 0;
  public skippedSpecs = 0;
  public totalSpecsDefined = 0;
  public executedSpecs = 0;
  public globalErrors: CustomReporterResult[] = [];
  public duration: string;
  public random = false;
  public seed: string;

  private startTime: number;
  private specStartTime: number;

  public start(suiteInfo: SuiteInfo): void {
    this.startTime = new Date().getTime();
    this.totalSpecsDefined =
      suiteInfo && suiteInfo.totalSpecsDefined
        ? suiteInfo.totalSpecsDefined
        : 0;
  }

  public stop(runDetails: RunDetails): void {
    const totalSpecs =
      this.failedSpecs + this.successfulSpecs + this.pendingSpecs;
    this.duration = this.formatDuration(new Date().getTime() - this.startTime);
    this.executedSpecs = this.failedSpecs + this.successfulSpecs;
    this.totalSpecsDefined = this.totalSpecsDefined
      ? this.totalSpecsDefined
      : totalSpecs;
    this.skippedSpecs = this.totalSpecsDefined - totalSpecs;
    this.random = runDetails.order.random;
    this.seed = runDetails.order.seed;
  }

  public startSpec(): void {
    this.specStartTime = new Date().getTime();
  }

  public stopSpec(result: CustomReporterResult): void {
    result.duration = this.formatDuration(
      new Date().getTime() - this.specStartTime
    );
  }

  private formatDuration(durationInMs: number): string {
    let duration = "";
    let durationInSecs = durationInMs / 1000;
    let durationInMins: number;
    let durationInHrs: number;
    if (durationInSecs < 1) {
      return `${durationInSecs} sec${ExecutionMetrics.pluralize(
        durationInSecs
      )}`;
    }
    durationInSecs = Math.round(durationInSecs);
    if (durationInSecs < 60) {
      return `${durationInSecs} sec${ExecutionMetrics.pluralize(
        durationInSecs
      )}`;
    }
    durationInMins = Math.floor(durationInSecs / 60);
    durationInSecs = durationInSecs % 60;
    if (durationInSecs) {
      duration = ` ${durationInSecs} sec${ExecutionMetrics.pluralize(
        durationInSecs
      )}`;
    }
    if (durationInMins < 60) {
      return `${durationInMins} min${ExecutionMetrics.pluralize(
        durationInMins
      )}${duration}`;
    }
    durationInHrs = Math.floor(durationInMins / 60);
    durationInMins = durationInMins % 60;
    if (durationInMins) {
      duration = ` ${durationInMins} min${ExecutionMetrics.pluralize(
        durationInMins
      )}${duration}`;
    }
    return `${durationInHrs} hour${ExecutionMetrics.pluralize(
      durationInHrs
    )}${duration}`;
  }
}
