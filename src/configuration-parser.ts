import { Configuration } from "./configuration";

export class ConfigurationParser {
    public static parse(conf?: Configuration): Configuration {
        return ConfigurationParser.merge(ConfigurationParser.defaultConfiguration, conf);
    }

    private static isWindows: boolean = process && process.platform === "win32";
    private static defaultConfiguration: Configuration = {
        colors: {
            enabled: true,
            failed: "red",
            pending: "yellow",
            successful: "green",
        },
        customProcessors: [],
        prefixes: {
            failed: ConfigurationParser.isWindows ? "\u00D7 " : "✗ ",
            pending: "* ",
            successful: ConfigurationParser.isWindows ? "\u221A " : "✓ ",
        },
        spec: {
            displayDuration: false,
            displayFailed: true,
            displayPending: false,
            displayStacktrace: false,
            displaySuccessful: true,
        },
        suite: {
            displayNumber: false,
        },
        summary: {
            displayFailed: true,
            displayPending: true,
            displayStacktrace: false,
            displaySuccessful: false,
        },
    };

    private static merge(template: any, override: any): Configuration {
        const result: any = {};
        for (const key in template) {
            if (template[key] instanceof Object
                && !(template[key] instanceof Array)
                && override instanceof Object
                && override[key] instanceof Object
                && !(override[key] instanceof Array)) {
                result[key] = ConfigurationParser.merge(template[key], override[key]);
            } else if (override instanceof Object
                        && Object.keys(override).indexOf(key) !== -1) {
                result[key] = override[key];
            } else {
                result[key] = template[key];
            }
        }
        if (override instanceof Object && override.customOptions) {
            result.customOptions = override.customOptions;
        }
        return result;
    };
}
