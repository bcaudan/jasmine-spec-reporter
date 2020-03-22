import * as fs from "fs";
import {StacktraceOption} from "../configuration";
import {DisplayProcessor} from "../display-processor";
import {CustomReporterResult} from "../spec-reporter";

const STACK_REG_EXP = /\((.*):(\d+):(\d+)\)/;
const CONTEXT = 2;

export class PrettyStacktraceProcessor extends DisplayProcessor {

    public displaySpecErrorMessages(spec: CustomReporterResult, log: string): string {
        return this.configuration.spec.displayStacktrace === StacktraceOption.PRETTY ? this.displayErrorMessages(spec) : log;
    }

    public displaySummaryErrorMessages(spec: CustomReporterResult, log: string): string {
        return this.configuration.summary.displayStacktrace === StacktraceOption.PRETTY ? this.displayErrorMessages(spec) : log;
    }

    private displayErrorMessages(spec: CustomReporterResult) {
        const logs: string[] = [];
        for (const failedExpectation of spec.failedExpectations) {
            logs.push("- ".failed + failedExpectation.message.failed);
            if (failedExpectation.stack) {
                logs.push(this.prettifyStack(failedExpectation.stack));
            }
        }
        return logs.join("\n");
    }

    private prettifyStack(stack: string) {
        const logs: string[] = [];
        const filteredStack = this.configuration.stacktrace.filter(stack);
        const stackRegExp = new RegExp(STACK_REG_EXP);
        filteredStack.split("\n").forEach(stackLine => {
            if (stackRegExp.test(stackLine)) {
                const [, filename, lineNumber, columnNumber] = stackLine.match(stackRegExp);
                const errorContext = this.retrieveErrorContext(
                    filename,
                    parseInt(lineNumber, 10),
                    parseInt(columnNumber, 10)
                );

                logs.push(`${filename.prettyStacktraceFilename}:${lineNumber.prettyStacktraceLineNumber}:${columnNumber.prettyStacktraceColumnNumber}`);
                logs.push(`${errorContext}\n`);
            }
        });
        return `\n${logs.join("\n")}`;
    }

    private retrieveErrorContext(filename: string, lineNb: number, columnNb: number) {
        const logs = [];
        const fileLines = fs.readFileSync(filename, "utf-8")
            .split("\n");
        for (let i = 0; i < fileLines.length; i++) {
            const errorLine = lineNb - 1;

            if (i >= errorLine - CONTEXT && i <= errorLine + CONTEXT) {
                logs.push(fileLines[i]);
            }
            if (i === errorLine) {
                logs.push(" ".repeat(columnNb - 1) + "~".red);
            }
        }
        return logs.join("\n");
    }
}
