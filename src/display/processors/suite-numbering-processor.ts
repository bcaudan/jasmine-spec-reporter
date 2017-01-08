import { DisplayProcessor } from "../display-processor";

export class SuiteNumberingProcessor extends DisplayProcessor {
    private static getParentName(element: any): String {
        return element.fullName.replace(element.description, "").trim();
    }

    private suiteHierarchy: any[] = [];

    public displaySuite(suite: any, log: String): String {
        return `${this.computeNumber(suite)} ${log}`;
    }

    private computeNumber(suite: any): String {
        this.computeHierarchy(suite);
        return this.computeHierarchyNumber();
    }

    private computeHierarchy(suite: any): void {
        const parentName = SuiteNumberingProcessor.getParentName(suite);
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

    private computeHierarchyNumber(): String {
        let hierarchyNumber: String = "";
        for (const suite of this.suiteHierarchy) {
            hierarchyNumber += suite.number + ".";
        }
        return hierarchyNumber.substring(0, hierarchyNumber.length - 1);
    }
}
