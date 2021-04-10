import { DisplayProcessor } from '../display-processor'
import { CustomReporterResult } from '../spec-reporter'

export class SpecPrefixesProcessor extends DisplayProcessor {
  public displaySuccessfulSpec(spec: CustomReporterResult, log: string): string {
    return this.configuration.prefixes.successful + log
  }

  public displayFailedSpec(spec: CustomReporterResult, log: string): string {
    return this.configuration.prefixes.failed + log
  }

  public displayPendingSpec(spec: CustomReporterResult, log: string): string {
    return this.configuration.prefixes.pending + log
  }
}
