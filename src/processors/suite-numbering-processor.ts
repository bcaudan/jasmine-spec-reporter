import { DisplayProcessor } from "../display-processor";
import { CustomReporterResult } from "../spec-reporter";

interface SuiteHierarchyInfo {
  name: string;
  number: number;
}

export class SuiteNumberingProcessor extends DisplayProcessor {
  private static getParentName(element: CustomReporterResult): string {
    return element.fullName.replace(element.description, "").trim();
  }

  private suiteHierarchy: SuiteHierarchyInfo[] = [];

  public displaySuite(suite: CustomReporterResult, log: string): string {
    return `${this.computeNumber(suite)} ${log}`;
  }

  private computeNumber(suite: CustomReporterResult): string {
    this.computeHierarchy(suite);
    return this.computeHierarchyNumber();
  }

  private computeHierarchy(suite: CustomReporterResult): void {
    const parentName: string = SuiteNumberingProcessor.getParentName(suite);
    let i = 0;
    for (; i < this.suiteHierarchy.length; i++) {
      if (this.suiteHierarchy[i].name === parentName) {
        this.suiteHierarchy[i].number++;
        this.suiteHierarchy.splice(i + 1, this.suiteHierarchy.length - i - 1);
        break;
      }
    }
    if (i === this.suiteHierarchy.length) {
      this.suiteHierarchy.push({ name: parentName, number: 1 });
    }
  }

  private computeHierarchyNumber(): string {
    let hierarchyNumber = "";
    for (const suite of this.suiteHierarchy) {
      hierarchyNumber += suite.number + ".";
    }
    return hierarchyNumber.substring(0, hierarchyNumber.length - 1);
  }
}
