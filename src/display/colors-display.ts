import * as colors from "colors";
import {Configuration} from "../configuration";

export function init(configuration: Configuration): void {
    (colors as any).enabled = configuration.colors.enabled;
    colors.setTheme({
        failed: configuration.colors.failed,
        pending: configuration.colors.pending,
        successful: configuration.colors.successful,
        prettyStacktraceFilename: configuration.colors.prettyStacktraceFilename,
        prettyStacktraceLineNumber: configuration.colors.prettyStacktraceLineNumber,
        prettyStacktraceColumnNumber: configuration.colors.prettyStacktraceColumnNumber,
        prettyStacktraceError: configuration.colors.prettyStacktraceError,
    });
}
