import colors = require("colors");
import { Configuration } from "../configuration";

export class ColorsDisplay {
    static init(configuration: Configuration): void {
        colors.enabled = configuration.colors.enabled;
        colors.setTheme({
            successful: configuration.colors.successful,
            failed: configuration.colors.failed,
            pending: configuration.colors.pending
        });
    }
}
