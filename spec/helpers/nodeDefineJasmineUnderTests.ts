declare namespace NodeJS {
    export interface Global {
        getJasmineRequireObj;
        j$;
    }
}

(() => {
    /**
     * Adaptation of jasmine `nodeDefineJasmineUnderTests.js` in order to test jasmine with jasmine.
     * See https://github.com/jasmine/jasmine/blob/master/CONTRIBUTING.md#self-testing
     */
    const j$Require = require("jasmine-core");
    const jasmineConsole = require("../../node_modules/jasmine-core/lib/console/console.js");

    global.getJasmineRequireObj = () => {
        return j$Require;
    };

    function extend(destination, source) {
        for (const property in source) {
            if ({}.hasOwnProperty.call(source, property)) {
                destination[property] = source[property];
            }
        }
        return destination;
    }

    extend(j$Require, jasmineConsole);

    global.j$ = j$Require.core(j$Require);

    j$Require.console(j$Require, global.j$);
})();
