import { Configuration } from "../configuration";
import { DisplayProcessor } from "../display-processor";
import { CustomReporterResult, ExecutedSpecs } from "../spec-reporter";
import * as ColorsDisplay from "./colors-display";
import { Logger } from "./logger";

import SuiteInfo = jasmine.SuiteInfo;

export class ExecutionDisplay {
  private static hasCustomDisplaySpecStarted(
    processors: DisplayProcessor[]
  ): boolean {
    let isDisplayed = false;
    processors.forEach((processor: DisplayProcessor) => {
      const log = "foo";
      const result = processor.displaySpecStarted(
        { id: "bar", description: "bar", fullName: "bar" },
        log
      );
      isDisplayed = isDisplayed || result !== log;
    });
    return isDisplayed;
  }

  private suiteHierarchy: CustomReporterResult[] = [];
  private suiteHierarchyDisplayed: CustomReporterResult[] = [];
  private hasCustomDisplaySpecStarted: boolean;

  constructor(
    private configuration: Configuration,
    private logger: Logger,
    private specs: ExecutedSpecs,
    displayProcessors: DisplayProcessor[]
  ) {
    ColorsDisplay.init(this.configuration);
    this.hasCustomDisplaySpecStarted = ExecutionDisplay.hasCustomDisplaySpecStarted(
      displayProcessors
    );
  }

  public jasmineStarted(suiteInfo: SuiteInfo): void {
    this.logger.process(
      suiteInfo,
      (displayProcessor: DisplayProcessor, object: SuiteInfo, log: string) => {
        return displayProcessor.displayJasmineStarted(object, log);
      }
    );
  }

  public specStarted(result: CustomReporterResult): void {
    if (this.hasCustomDisplaySpecStarted) {
      this.ensureSuiteDisplayed();
      this.logger.process(
        result,
        (
          displayProcessor: DisplayProcessor,
          object: CustomReporterResult,
          log: string
        ) => {
          return displayProcessor.displaySpecStarted(object, log);
        }
      );
    }
  }

  public successful(result: CustomReporterResult): void {
    this.specs.successful.push(result);
    if (this.configuration.spec.displaySuccessful) {
      this.ensureSuiteDisplayed();
      this.logger.process(
        result,
        (
          displayProcessor: DisplayProcessor,
          object: CustomReporterResult,
          log: string
        ) => {
          return displayProcessor.displaySuccessfulSpec(object, log);
        }
      );
    }
  }

  public failed(result: CustomReporterResult): void {
    this.specs.failed.push(result);
    if (this.configuration.spec.displayFailed) {
      this.ensureSuiteDisplayed();
      this.logger.process(
        result,
        (
          displayProcessor: DisplayProcessor,
          object: CustomReporterResult,
          log: string
        ) => {
          return displayProcessor.displayFailedSpec(object, log);
        }
      );
      if (this.configuration.spec.displayErrorMessages) {
        this.logger.increaseIndent();
        this.logger.process(
          result,
          (
            displayProcessor: DisplayProcessor,
            object: CustomReporterResult,
            log: string
          ) => {
            return displayProcessor.displaySpecErrorMessages(object, log);
          }
        );
        this.logger.decreaseIndent();
      }
    }
  }

  public pending(result: CustomReporterResult): void {
    this.specs.pending.push(result);
    if (this.configuration.spec.displayPending) {
      this.ensureSuiteDisplayed();
      this.logger.process(
        result,
        (
          displayProcessor: DisplayProcessor,
          object: CustomReporterResult,
          log: string
        ) => {
          return displayProcessor.displayPendingSpec(object, log);
        }
      );
    }
  }

  public suiteStarted(result: CustomReporterResult): void {
    this.suiteHierarchy.push(result);
  }

  public suiteDone(result: CustomReporterResult): void {
    if (
      result &&
      result.failedExpectations &&
      result.failedExpectations.length
    ) {
      this.failed(result);
    }
    const suite: CustomReporterResult = this.suiteHierarchy.pop();
    if (
      this.suiteHierarchyDisplayed[this.suiteHierarchyDisplayed.length - 1] ===
      suite
    ) {
      this.suiteHierarchyDisplayed.pop();
    }
    this.logger.newLine();
    this.logger.decreaseIndent();
  }

  private ensureSuiteDisplayed(): void {
    if (this.suiteHierarchy.length !== 0) {
      for (
        let i = this.suiteHierarchyDisplayed.length;
        i < this.suiteHierarchy.length;
        i++
      ) {
        this.suiteHierarchyDisplayed.push(this.suiteHierarchy[i]);
        this.displaySuite(this.suiteHierarchy[i]);
      }
    } else {
      const name = "Top level suite";
      const topLevelSuite: CustomReporterResult = {
        description: name,
        fullName: name,
        id: name
      };
      this.suiteHierarchy.push(topLevelSuite);
      this.suiteHierarchyDisplayed.push(topLevelSuite);
      this.displaySuite(topLevelSuite);
    }
  }

  private displaySuite(suite: CustomReporterResult): void {
    this.logger.newLine();
    this.computeSuiteIndent();
    this.logger.process(
      suite,
      (
        displayProcessor: DisplayProcessor,
        object: CustomReporterResult,
        log: string
      ) => {
        return displayProcessor.displaySuite(object, log);
      }
    );
    this.logger.increaseIndent();
  }

  private computeSuiteIndent(): void {
    this.logger.resetIndent();
    this.suiteHierarchyDisplayed.forEach(() => this.logger.increaseIndent());
  }
}
