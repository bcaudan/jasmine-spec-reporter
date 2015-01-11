var DisplayProcessor = require('../display-processor');

function SuiteNumberingProcessor() {
  this.currentHierarchy = [];

  this.computeNumber = function (suite) {
    this.computeHierarchy(suite);
    return this.computeHierarchyNumber();
  };

  this.computeHierarchy = function (suite) {
    var parentName = this.getParentName(suite);
    for (var i = 0 ; i < this.currentHierarchy.length ; i++) {
      if (this.currentHierarchy[i].name == parentName) {
        this.currentHierarchy[i].number++;
        this.currentHierarchy.splice(i + 1, this.currentHierarchy.length - i - 1);
        break;
      }
    }
    if (i == this.currentHierarchy.length) {
      this.currentHierarchy.push({name: parentName, number: 1})
    }
  };

  this.computeHierarchyNumber = function () {
    var number = '';
    for (var i = 0 ; i < this.currentHierarchy.length ; i++) {
      number += this.currentHierarchy[i].number + '.';
    }
    return number.substring(0, number.length - 1);
  };

  this.getParentName = function (element) {
    return element.fullName.replace(element.description, '').trim();
  }
}

SuiteNumberingProcessor.prototype = new DisplayProcessor();

SuiteNumberingProcessor.prototype.displaySuite = function (suite, log) {
  return this.computeNumber(suite) + ' ' + log;
};

module.exports = SuiteNumberingProcessor;
