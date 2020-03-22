import {StacktraceOption} from "../../built/configuration";
import * as ConfigurationParser from "../../built/configuration-parser";
import {TestProcessor} from "../helpers/test-processor";

describe("Configuration parser", () => {
    it("should have a default configuration", () => {
        expect(ConfigurationParser.parse().spec).toBeDefined();
        expect(ConfigurationParser.parse(null).spec).toBeDefined();
        expect(ConfigurationParser.parse({}).spec).toBeDefined();
    });

    it("should extend given configuration with default properties", () => {
        expect(ConfigurationParser.parse({
            customProcessors: [TestProcessor],
        }).customProcessors).toContain(TestProcessor);
        expect(ConfigurationParser.parse().suite.displayNumber).toBe(false);
        expect(ConfigurationParser.parse({suite: {displayNumber: true}}).suite.displayNumber).toBe(true);
    });

    it("should add custom options", () => {
        expect(ConfigurationParser.parse({customOptions: {test: "foo"}}).customOptions).toEqual({test: "foo"});
    });

    it("should warn if outdated `displayStacktrace` boolean value is used", () => {
        spyOn(console, "warn");
        expect(ConfigurationParser.parse({spec: {displayStacktrace: true as any}}).spec.displayStacktrace).toEqual(StacktraceOption.NONE);
        // tslint:disable-next-line:no-unbound-method
        expect(console.warn).toHaveBeenCalled();
    });
});
