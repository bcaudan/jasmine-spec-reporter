import * as colors from 'colors/safe'
import { Configuration } from './configuration'

interface ColorsTheme {
  successful(str: string): string
  failed(str: string): string
  pending(str: string): string
  prettyStacktraceFilename(str: string): string
  prettyStacktraceLineNumber(str: string): string
  prettyStacktraceColumnNumber(str: string): string
  prettyStacktraceError(str: string): string
}

const colorsTheme = (colors as unknown) as ColorsTheme

export class Theme {
  constructor(configuration: Configuration) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    configuration.colors.enabled ? colors.enable() : colors.disable()
    colors.setTheme({
      failed: configuration.colors.failed,
      pending: configuration.colors.pending,
      successful: configuration.colors.successful,
      prettyStacktraceFilename: configuration.colors.prettyStacktraceFilename,
      prettyStacktraceLineNumber: configuration.colors.prettyStacktraceLineNumber,
      prettyStacktraceColumnNumber: configuration.colors.prettyStacktraceColumnNumber,
      prettyStacktraceError: configuration.colors.prettyStacktraceError,
    })
  }

  successful(str: string) {
    return colorsTheme.successful(str)
  }

  failed(str: string) {
    return colorsTheme.failed(str)
  }

  pending(str: string) {
    return colorsTheme.pending(str)
  }

  prettyStacktraceFilename(str: string) {
    return colorsTheme.prettyStacktraceFilename(str)
  }

  prettyStacktraceLineNumber(str: string) {
    return colorsTheme.prettyStacktraceLineNumber(str)
  }

  prettyStacktraceColumnNumber(str: string) {
    return colorsTheme.prettyStacktraceColumnNumber(str)
  }

  prettyStacktraceError(str: string) {
    return colorsTheme.prettyStacktraceError(str)
  }
}
