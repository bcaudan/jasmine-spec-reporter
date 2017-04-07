import {DisplayProcessor} from "../display-processor";
import {CustomReporterResult} from "../spec-reporter";
import SuiteInfo = jasmine.SuiteInfo;

export type ProcessFunction = (displayProcessor: DisplayProcessor, object: ProcessObject, log: String) => String;
export type ProcessObject = SuiteInfo | CustomReporterResult;

export class Logger {
    private indent = "  ";
    private currentIndent = "";
    private lastWasNewLine = false;

    constructor(private displayProcessors: DisplayProcessor[], private print: (line: String) => void) {
    }

    public log(stuff: String): void {
        stuff.split("\n").forEach((line: String) => {
            this.print(line !== "" ? this.currentIndent + line : line);
        });
        this.lastWasNewLine = false;
    }

    public process(object: ProcessObject, processFunction: ProcessFunction): void {
        let log: String = "";
        this.displayProcessors.forEach((displayProcessor: DisplayProcessor) => {
            log = processFunction(displayProcessor, object, log);
        });
        this.log(log);
    }

    public newLine(): void {
        if (!this.lastWasNewLine) {
            this.log("");
            this.lastWasNewLine = true;
        }
    }

    public resetIndent(): void {
        this.currentIndent = "";
    }

    public increaseIndent(): void {
        this.currentIndent += this.indent;
    }

    public decreaseIndent(): void {
        this.currentIndent = this.currentIndent.substr(0, this.currentIndent.length - this.indent.length);
    }
}
