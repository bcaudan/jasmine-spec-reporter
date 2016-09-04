import {DisplayProcessor} from '../display-processor';

export class SpecPrefixesProcessor extends DisplayProcessor {
    constructor(private prefixes) {
        super();
        var successSymbol = '✓ ',
            failureSymbol = '✗ ',
            pendingSymbol = '* ';

        if (process && process.platform === 'win32') {
            successSymbol = '\u221A ';
            failureSymbol = '\u00D7 ';
            pendingSymbol = '* ';
        }

        this.prefixes = {
            success: prefixes && prefixes.success !== undefined ? prefixes.success : successSymbol,
            failure: prefixes && prefixes.failure !== undefined ? prefixes.failure : failureSymbol,
            pending: prefixes && prefixes.pending !== undefined ? prefixes.pending : pendingSymbol
        }
    }

    displaySuccessfulSpec(spec, log) {
        return this.prefixes.success + log;
    }

    displayFailedSpec(spec, log) {
        return this.prefixes.failure + log;
    }

    displayPendingSpec(spec, log) {
        return this.prefixes.pending + log;
    }
}
