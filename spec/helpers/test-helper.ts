const stripTime = (str: string) =>
  str
    .replace(/in (\d+\.?\d*|\.\d+) secs?/, 'in {time}') // replace time in summary
    .replace(/\((\d+\.?\d*|\.\d+) secs?\)/, '({time})') // replace time in specs

const isArray = (value) => value.toString() === '[object Array]'

const typeIsArray = (value) => Array.isArray(value) || isArray(value)

const equalOrMatch = (actual, expected) => {
  return expected === actual || (expected.test && expected.test(actual))
}

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace jasmine {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface Matchers<T> {
    contains(expected: any, expectationFailOutput?: any): boolean
  }
}

const addMatchers = () => {
  jasmine.addMatchers({
    contains: () => {
      return {
        compare: (actual, sequence) => {
          let i
          let j
          if (!typeIsArray(sequence)) {
            sequence = [sequence]
          }
          i = 0
          while (i < actual.length - sequence.length + 1) {
            j = 0
            while (j < sequence.length && equalOrMatch(actual[i + j], sequence[j])) {
              j++
            }
            if (j === sequence.length) {
              return {
                pass: true,
              }
            }
            i++
          }
          return {
            pass: false,
            message: `Expect\n${actual.join('\n')}\nto contains\n${sequence.join('\n')}`,
          }
        },
      }
    },
  })
}

const JasmineEnv = {
  execute(reporter, testFn, assertionsFn, options: { withColor?: boolean; random?: boolean } = {}) {
    const { outputs, summary } = JasmineEnv.init(options)
    JasmineEnv.run(reporter, testFn, assertionsFn, options, outputs, summary)
  },
  init(options) {
    let logInSummary
    const outputs = []
    const summary = []
    logInSummary = false
    console.log = (stuff) => {
      if (!options.withColor) {
        stuff = global.colors.stripColors(stripTime(stuff))
      }
      if (/^(Executed|\*\*\*\*\*\*\*)/.test(stuff)) {
        logInSummary = true
      }
      if (!logInSummary) {
        return outputs.push(stuff)
      } else {
        return summary.push(stuff)
      }
    }
    return { outputs, summary }
  },
  run(reporter, testFn, assertionsFn, options, outputs, summary) {
    const env = new global.jasmineUnderTest.Env()
    env.configure({ random: false })
    env.passed = () => {
      env.expect(true).toBe(true)
    }
    env.failed = () => {
      env.expect(true).toBe(false)
    }
    env.failedWithFakeStack = () => {
      env.addMatchers({
        throw: () => {
          return {
            compare: () => {
              throw new Error('oops')
            },
          }
        },
      })
      env.expect().throw()
    }
    testFn(env)
    env.addReporter(reporter)
    env.addReporter({
      jasmineDone: () => {
        assertionsFn(outputs, summary)
      },
    })
    if (options.random) {
      env.configure({ random: true })
    }
    env.execute()
  },
}

// eslint-disable-next-line @typescript-eslint/no-namespace,@typescript-eslint/no-unused-vars
declare namespace NodeJS {
  export interface Global {
    JasmineEnv
  }
}

global.JasmineEnv = JasmineEnv
exports.addMatchers = addMatchers
