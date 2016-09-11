import { SpecReporter } from "jasmine-spec-reporter";
import { DisplayProcessor } from "jasmine-spec-reporter";

class CustomProcessor extends DisplayProcessor {
    displayJasmineStarted(info, log: String): String {
        return `TypeScript ${log}`;
    }
}

let Jasmine = require("jasmine");
let noop = () => {};

let jrunner = new Jasmine();
jrunner.configureDefaultReporter({ print: noop });
jrunner.addReporter(new SpecReporter({
    customProcessors: [CustomProcessor]
}));
jrunner.loadConfigFile();
jrunner.execute();
