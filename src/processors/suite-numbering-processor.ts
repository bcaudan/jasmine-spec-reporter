import {DisplayProcessor} from '../display-processor';

export class SuiteNumberingProcessor extends DisplayProcessor {
    private suiteHierarchy = [];

    displaySuite(suite, log) {
        return this.computeNumber(suite) + ' ' + log;
    }

    private computeNumber = function (suite) {
        this.computeHierarchy(suite);
        return this.computeHierarchyNumber();
    };

    private computeHierarchy = function (suite) {
        var parentName = this.getParentName(suite);
        for (var i = 0; i < this.suiteHierarchy.length; i++) {
            if (this.suiteHierarchy[i].name === parentName) {
                this.suiteHierarchy[i].number++;
                this.suiteHierarchy.splice(i + 1, this.suiteHierarchy.length - i - 1);
                break;
            }
        }
        if (i === this.suiteHierarchy.length) {
            this.suiteHierarchy.push({name: parentName, number: 1});
        }
    };

    private computeHierarchyNumber = function () {
        var number = '';
        for (var i = 0; i < this.suiteHierarchy.length; i++) {
            number += this.suiteHierarchy[i].number + '.';
        }
        return number.substring(0, number.length - 1);
    };

    private getParentName = function (element) {
        return element.fullName.replace(element.description, '').trim();
    };
}
