import {exec} from "child_process";
import {readFileSync} from "fs";
const JsDiff = require("diff");

// https://github.com/jasmine/jasmine-npm/issues/85
process.env.JASMINE_CONFIG_PATH = "spec/support/jasmine.json";
const TIMEOUT_INCREASED = 240000;

const filter = diff => {
    const value = element => {
        return element.value;
    };
    const added = diff.filter(element => {
        return element.added === true;
    }).map(value);
    const removed = diff.filter(element => {
        return element.removed === true;
    }).map(value);
    return {added, removed};
};

describe("Integration", () => {
    it("with jasmine-npm should be ok", done => {
        exec("cd examples/node && npm test -s", (error, stdout) => {
            const expected = readFileSync("spec/resources/node-example.out", {encoding: "utf-8"});
            const {added, removed} = filter(JsDiff.diffLines(expected, stdout));
            expect(added).toEqual(removed);
            done();
        });
    }, TIMEOUT_INCREASED);

    it("with protractor should be ok", done => {
        exec("cd examples/protractor && npm test -s", (error, stdout) => {
            // workaround for protractor pending error output
            stdout = stdout.replace(/\[\d+:\d+:\d+\].*\n/, "");

            const expected = readFileSync("spec/resources/node-protractor.out", {encoding: "utf-8"});
            const {added, removed} = filter(JsDiff.diffLines(expected, stdout));
            expect(added).toEqual(removed);
            done();
        });
    }, TIMEOUT_INCREASED);
});
