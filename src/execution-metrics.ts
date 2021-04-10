import { CustomReporterResult } from './spec-reporter'

import SuiteInfo = jasmine.SuiteInfo
import RunDetails = jasmine.RunDetails

export class ExecutionMetrics {
  private static pluralize(count: number): string {
    return count > 1 ? 's' : ''
  }

  public successfulSpecs = 0
  public failedSpecs = 0
  public pendingSpecs = 0
  public skippedSpecs = 0
  public totalSpecsDefined = 0
  public executedSpecs = 0
  public globalErrors: CustomReporterResult[] = []
  public duration: string
  public random = false
  public seed: string

  private startTime: number
  private specStartTime: number

  public start(suiteInfo: SuiteInfo): void {
    this.startTime = new Date().getTime()
    this.totalSpecsDefined = suiteInfo && suiteInfo.totalSpecsDefined ? suiteInfo.totalSpecsDefined : 0
  }

  public stop(runDetails: RunDetails): void {
    const totalSpecs = this.failedSpecs + this.successfulSpecs + this.pendingSpecs
    this.duration = this.formatDuration(new Date().getTime() - this.startTime)
    this.executedSpecs = this.failedSpecs + this.successfulSpecs
    this.totalSpecsDefined = this.totalSpecsDefined ? this.totalSpecsDefined : totalSpecs
    this.skippedSpecs = this.totalSpecsDefined - totalSpecs
    this.random = runDetails.order.random
    this.seed = runDetails.order.seed
  }

  public startSpec(): void {
    this.specStartTime = new Date().getTime()
  }

  public stopSpec(result: CustomReporterResult): void {
    // eslint-disable-next-line no-underscore-dangle
    result._jsr = {
      formattedDuration: this.formatDuration(new Date().getTime() - this.specStartTime),
    }
  }

  private formatDuration(durationInMs: number): string {
    let duration = ''
    let durationInSeconds = durationInMs / 1000
    if (durationInSeconds < 1) {
      return `${durationInSeconds} sec${ExecutionMetrics.pluralize(durationInSeconds)}`
    }
    durationInSeconds = Math.round(durationInSeconds)
    if (durationInSeconds < 60) {
      return `${durationInSeconds} sec${ExecutionMetrics.pluralize(durationInSeconds)}`
    }

    let durationInMinutes = Math.floor(durationInSeconds / 60)
    durationInSeconds = durationInSeconds % 60
    if (durationInSeconds) {
      duration = ` ${durationInSeconds} sec${ExecutionMetrics.pluralize(durationInSeconds)}`
    }
    if (durationInMinutes < 60) {
      return `${durationInMinutes} min${ExecutionMetrics.pluralize(durationInMinutes)}${duration}`
    }

    const durationInHours = Math.floor(durationInMinutes / 60)
    durationInMinutes = durationInMinutes % 60
    if (durationInMinutes) {
      duration = ` ${durationInMinutes} min${ExecutionMetrics.pluralize(durationInMinutes)}${duration}`
    }
    return `${durationInHours} hour${ExecutionMetrics.pluralize(durationInHours)}${duration}`
  }
}
