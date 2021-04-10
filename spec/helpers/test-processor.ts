import { Configuration } from '../../built/configuration'
import { DisplayProcessor } from '../../built/main'
import { Theme } from '../../src/theme'

export class TestProcessor extends DisplayProcessor {
  private test: string

  constructor(configuration: Configuration, theme: Theme) {
    super(configuration, theme)
    this.test = configuration.customOptions.test
  }

  public displayJasmineStarted(info: any, log: string): string {
    return log + this.test
  }

  public displaySuite(suite: any, log: string): string {
    return log + this.test
  }

  public displaySpecStarted(spec: any): string {
    return spec.description + this.test
  }

  public displaySuccessfulSpec(spec: any, log: string): string {
    return log + this.test
  }

  public displayFailedSpec(spec: any, log: string): string {
    return log + this.test
  }

  public displaySpecErrorMessages(spec: any, log: string): string {
    return log + this.test
  }

  public displaySummaryErrorMessages(spec: any, log: string): string {
    return log + this.test
  }

  public displayPendingSpec(spec: any, log: string): string {
    return log + this.test
  }
}
