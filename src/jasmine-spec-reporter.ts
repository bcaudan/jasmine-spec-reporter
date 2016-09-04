import {SpecDisplay} from "./spec-display";
import {SpecMetrics} from "./spec-metrics";

import {DefaultProcessor} from './processors/default-processor';
import {SpecColorsProcessor} from './processors/spec-colors-processor';
import {SpecDurationsProcessor} from './processors/spec-durations-processor';
import {SpecPrefixesProcessor} from './processors/spec-prefixes-processor';
import {SuiteNumberingProcessor} from './processors/suite-numbering-processor';

var colors = require('colors');

module.exports = class SpecReporter {
    private started = false;
    private finished = false;
    private options;
    private display;
    private metrics;

    constructor(options) {
        this.options = options || {};
        SpecReporter.initColors(this.options);
        var displayProcessors = SpecReporter.initProcessors(this.options);
        this.options.hasCustomDisplaySpecStarted = SpecReporter.hasCustomDisplaySpecStarted(displayProcessors);

        this.display = new SpecDisplay(this.options, displayProcessors);
        this.metrics = new SpecMetrics();
    };

    private static initColors(options) {
        colors.setTheme({
            success: options.colors && options.colors.success ? options.colors.success : 'green',
            failure: options.colors && options.colors.failure ? options.colors.failure : 'red',
            pending: options.colors && options.colors.pending ? options.colors.pending : 'yellow'
        });
        colors.enabled = true;
    }

    private static initProcessors(options) {
        var displayProcessors = [
            new DefaultProcessor(),
            new SpecPrefixesProcessor(options.prefixes),
            new SpecColorsProcessor()
        ];

        if (options.displaySpecDuration) {
            displayProcessors.push(new SpecDurationsProcessor());
        }

        if (options.displaySuiteNumber) {
            displayProcessors.push(new SuiteNumberingProcessor());
        }

        if (options.customProcessors) {
            options.customProcessors.forEach(function (Processor) {
                displayProcessors.push(new Processor(options));
            });
        }

        return displayProcessors;
    }

    private static hasCustomDisplaySpecStarted(processors) {
        var isDisplayed = false;
        processors.forEach(function (processor) {
            var log = 'foo';
            var result = processor.displaySpecStarted({id: 'bar', description: 'bar', fullName: 'bar'}, log);
            isDisplayed = isDisplayed || result !== log;
        });
        return isDisplayed;
    }

    jasmineStarted(info) {
        this.started = true;
        this.metrics.start(info);
        this.display.jasmineStarted(info);
    }

    jasmineDone(info) {
        this.metrics.stop(info);
        this.display.summary(this.metrics);
        this.finished = true;
    }

    suiteStarted(suite) {
        this.display.suiteStarted(suite);
    }

    suiteDone(suite) {
        this.display.suiteDone(suite);
    }

    specStarted(spec) {
        this.metrics.startSpec();
        this.display.specStarted(spec);
    }

    specDone(spec) {
        this.metrics.stopSpec(spec);
        if (spec.status === 'pending') {
            this.metrics.pendingSpecs++;
            this.display.pending(spec);
        } else if (spec.status === 'passed') {
            this.metrics.successfulSpecs++;
            this.display.successful(spec);
        } else if (spec.status === 'failed') {
            this.metrics.failedSpecs++;
            this.display.failed(spec);
        }
    }
};
