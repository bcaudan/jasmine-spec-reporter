(function() {
    if (! jasmine) {
        throw new Exception("jasmine library does not exist in global namespace!");
    }

    var SpecReporter = function() {
        this.started = false;
        this.finished = false;
    };

    SpecReporter.prototype = {
        reportRunnerStarting: function(runner) {
            this.started = true;
            this.startTime = (new Date()).getTime();
            this.executedSpecs = 0;
            this.passedSpecs = 0;
            this.currentSuiteId = -1;
            this.indent = "";
        },

        reportRunnerResults: function(runner) {
            var dur = (new Date()).getTime() - this.startTime;
            var failed = this.executedSpecs - this.passedSpecs;
            var spec_str = "Executed " + this.executedSpecs + (this.executedSpecs === 1 ? " spec " : " specs ");
            var fail_str = "(" + failed + (failed === 1 ? " failure) " : " failures) ");

            this.resetIndent();
            this.newLine();
            this.log(spec_str + fail_str + "in " + (dur/1000) + " secs.");
            this.finished = true;
        },

        reportSuiteResults: function() {},

        reportSpecStarting: function(spec) {
            this.executedSpecs++;
            var suite = spec.suite;
            if (suite.id !== this.currentSuiteId) {
                this.newLine();
                this.computeIndent(spec.suite);
                this.log(spec.suite.description);
                this.increaseIndent();
                this.currentSuiteId = spec.suite.id;
            }
        },

        reportSpecResults: function(spec) {
            if (spec.results().passed()) {
                this.passedSpecs++;
                this.log("✓ " + spec.results().description);
            } else {
                this.log("✗ " + spec.results().description);
                var items = spec.results().items_;
                this.increaseIndent();
                this.log("Message:");
                this.increaseIndent();
                for(var i = 0;  i < items.length ; i++ ) {
                    this.log(items[i].message);
                }
                this.decreaseIndent();
                this.decreaseIndent();
            }
        },

        log: function (stuff) {
            console.log(this.indent + stuff);
        },

        newLine: function() {
            this.log("");
        },

        computeIndent: function (suite) {
            this.resetIndent();
            var currentSuite = suite;
            while (currentSuite !== null) {
                this.indent += "  ";
                currentSuite = currentSuite.parentSuite;
            }
        },

        resetIndent: function () {
            this.indent = "";
        },

        increaseIndent: function () {
            this.indent += "  ";
        },

        decreaseIndent: function () {
            this.indent = this.indent.substr(0, this.indent.length - 2);
        }
    };

    // export public
    jasmine.SpecReporter = SpecReporter;
})();
