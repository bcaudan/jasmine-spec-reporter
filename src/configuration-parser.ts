import { Configuration } from "./configuration";

export class ConfigurationParser {
    private static isWindows: boolean = process && process.platform === "win32";
    private static defaultConfiguration: Configuration = {
        suite: {
            displayNumber: false,
        },
        spec: {
            displayStacktrace: false,
            displaySuccessful: true,
            displayFailed: true,
            displayPending: false,
            displayDuration: false,
        },
        summary: {
            displayStacktrace: false,
            displaySuccessful: false,
            displayFailed: true,
            displayPending: true,
        },
        colors: {
            enabled: true,
            successful: "green",
            failed: "red",
            pending: "yellow"
        },
        prefixes: {
            successful: ConfigurationParser.isWindows ? "\u221A " : "✓ ",
            failed: ConfigurationParser.isWindows ? "\u00D7 " : "✗ ",
            pending: "* "
        },
        customProcessors: []
    };

    static parse(conf?: Configuration): Configuration {
        return ConfigurationParser.merge(ConfigurationParser.defaultConfiguration, conf);
    }

    private static merge(template: any, override: any): Configuration {
        let result: any = {};
        for (let key in template) {
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
