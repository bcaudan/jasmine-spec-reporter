import colors = require("colors");
import { Configuration } from "../configuration";

export class ColorsDisplay {
    public static init(configuration: Configuration): void {
        colors.enabled = configuration.colors.enabled;
        colors.setTheme({
            failed: configuration.colors.failed,
            pending: configuration.colors.pending,
            successful: configuration.colors.successful,
        });
    }
}
