require("colors");

interface String {
    stripTime(): string;
}

// tslint:disable-next-line:no-unbound-method
String.prototype.stripTime = function(): string {
    return this.replace(/in (\d+\.?\d*|\.\d+) secs?/, "in {time}") // replace time in summary
        .replace(/\((\d+\.?\d*|\.\d+) secs?\)/, "({time})"); // replace time in specs
};

let isArray = value => value.toString() === "[object Array]";

let typeIsArray = value => Array.isArray(value) || isArray(value);

let equalOrMatch = (actual, expected) => {
    return expected === actual || (expected.test && expected.test(actual));
};

declare namespace jasmine {
    export interface Matchers<T> {
        contains(expected: any, expectationFailOutput?: any): boolean;
    }
}

let addMatchers = () => {
    beforeEach(() => {
        jasmine.addMatchers({
            contains: () => {
                return {
                    compare: (actual, sequence) => {
                        let i;
                        let j;
                        if (!typeIsArray(sequence)) {
                            sequence = [sequence];
                        }
                        i = 0;
                        while (i < actual.length - sequence.length + 1) {
                            j = 0;
                            while (j < sequence.length && equalOrMatch(actual[i + j], sequence[j])) {
                                j++;
                            }
                            if (j === sequence.length) {
                                return {
                                    pass: true,
                                };
                            }
                            i++;
                        }
                        return {
                            pass: false,
                        };
                    },
                };
            },
        });
    });
};

class Test {
    public outputs;
    public summary;

    constructor(private reporter, private testFn, withColor = false, options = {random: false}) {
        this.init(withColor);
        this.run(options);
    }

    public init(withColor) {
        let logInSummary;
        this.outputs = [];
        this.summary = [];
        logInSummary = false;
        console.log = stuff => {
            if (!withColor) {
                stuff = stuff.stripColors.stripTime();
            }
            if (/^(Executed|\*\*\*\*\*\*\*)/.test(stuff)) {
                logInSummary = true;
            }
            if (!logInSummary) {
                return this.outputs.push(stuff);
            } else {
                return this.summary.push(stuff);
            }
        };
    }

    public run(options) {
        const env = new global.j$.Env();
        env.passed = () => {
            env.expect(true).toBe(true);
        };
        env.failed = () => {
            env.expect(true).toBe(false);
        };
        this.testFn.apply(env);
        env.addReporter(this.reporter);
        if (options.random) {
            env.randomizeTests(true);
        }
        env.execute();
    }
}

declare namespace NodeJS {
    export interface Global {
        Test;
    }
}

global.Test = Test;
exports.addMatchers = addMatchers;
