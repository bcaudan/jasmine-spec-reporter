import { Configuration } from "../../built/configuration";
import { DisplayProcessor } from "../../built/main";

export class TestProcessor extends DisplayProcessor {
  private test: string;

  constructor(configuration: Configuration) {
    super(configuration);
    this.test = configuration.customOptions.test;
  }

  public displayJasmineStarted(info: any, log: string): string {
    return log + this.test;
  }

  public displaySuite(suite: any, log: string): string {
    return log + this.test;
  }

  public displaySpecStarted(spec: any, log: string): string {
    return spec.description + this.test;
  }

  public displaySuccessfulSpec(spec: any, log: string): string {
    return log + this.test;
  }

  public displayFailedSpec(spec: any, log: string): string {
    return log + this.test;
  }

  public displaySpecErrorMessages(spec: any, log: string): string {
    return log + this.test;
  }

  public displaySummaryErrorMessages(spec: any, log: string): string {
    return log + this.test;
  }

  public displayPendingSpec(spec: any, log: string): string {
    return log + this.test;
  }
}
