import { DisplayProcessor } from '../display-processor'
import { CustomReporterResult } from '../spec-reporter'

export class SpecDurationsProcessor extends DisplayProcessor {
  private static displayDuration(spec: CustomReporterResult, log: string): string {
    // eslint-disable-next-line no-underscore-dangle
    return `${log} (${spec._jsr && spec._jsr.formattedDuration})`
  }

  public displaySuccessfulSpec(spec: CustomReporterResult, log: string): string {
    return SpecDurationsProcessor.displayDuration(spec, log)
  }

  public displayFailedSpec(spec: CustomReporterResult, log: string): string {
    return SpecDurationsProcessor.displayDuration(spec, log)
  }
}
