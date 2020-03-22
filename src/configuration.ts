import {DisplayProcessor} from "./display-processor";

export enum StacktraceOption {
    NONE = "none",
    RAW = "raw",
    PRETTY = "pretty",
}

export class Configuration {
    public suite?: {
        /**
         * display each suite number (hierarchical)
         */
        displayNumber?: boolean;
    };
    public spec?: {
        /**
         * display error messages for each failed assertion
         */
        displayErrorMessages?: boolean;

        /**
         * display stacktrace for each failed assertion
         */
        displayStacktrace?: StacktraceOption;

        /**
         * display each successful spec
         */
        displaySuccessful?: boolean;

        /**
         * display each failed spec
         */
        displayFailed?: boolean;

        /**
         * display each pending spec
         */
        displayPending?: boolean;

        /**
         * display each spec duration
         */
        displayDuration?: boolean;
    };
    public summary?: {
        /**
         * display error messages for each failed assertion
         */
        displayErrorMessages?: boolean;

        /**
         * display stacktrace for each failed assertion
         */
        displayStacktrace?: StacktraceOption;

        /**
         * display summary of all successes after execution
         */
        displaySuccessful?: boolean;

        /**
         * display summary of all failures after execution
         */
        displayFailed?: boolean;

        /**
         * display summary of all pending specs after execution
         */
        displayPending?: boolean;

        /**
         * display execution duration
         */
        displayDuration?: boolean;
    };
    /**
     * Colors are displayed in the console via colors package: https://github.com/Marak/colors.js.
     * You can see all available colors on the project page.
     */
    public colors?: {
        /**
         * enable colors
         */
        enabled?: boolean;

        /**
         * color for successful spec
         */
        successful?: string;

        /**
         * color for failing spec
         */
        failed?: string;

        /**
         * color for pending spec
         */
        pending?: string
    };
    public prefixes?: {
        /**
         * prefix for successful spec
         */
        successful?: string;

        /**
         * prefix for failing spec
         */
        failed?: string;

        /**
         * prefix for pending spec
         */
        pending?: string
    };
    public stacktrace?: {
        /**
         * Customize stacktrace filtering
         */
        filter?(stacktrace: string): string;
    };
    /**
     * list of display processor to customize output
     * see https://github.com/bcaudan/jasmine-spec-reporter/blob/master/docs/customize-output.md
     */
    public customProcessors?: (typeof DisplayProcessor)[];
    /**
     * options for custom processors
     */
    public customOptions?: any;
    /**
     * Low-level printing function, defaults to console.log.
     * Use process.stdout.write(log + '\n'); to avoid output to
     * devtools console while still reporting to command line.
     */
    public print?: (log: string) => void;
}
