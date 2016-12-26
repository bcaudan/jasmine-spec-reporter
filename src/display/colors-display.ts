import colors = require("colors");

export class ColorsDisplay {
    static init(options: any): void {
        colors.setTheme({
            success: options.colors && options.colors.success ? options.colors.success : "green",
            failure: options.colors && options.colors.failure ? options.colors.failure : "red",
            pending: options.colors && options.colors.pending ? options.colors.pending : "yellow"
        });
        colors.enabled = true;
    }
}
