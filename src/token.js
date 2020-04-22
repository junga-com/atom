const _ = require('underscore-plus')

const StartDotRegex = /^\.?/

// Represents a single unit of text as selected by a grammar.
module.exports = class Token {
  constructor(properties) {
    ({value: this.value, scopes: this.scopes} = properties)
  }

  isEqual(other) {
    // TODO: scopes is deprecated. This is here for the sake of lang package tests
    return this.value == other.value && _.isEqual(this.scopes, other.scopes)
  }

  isBracket() {
    return /^meta\.brace\b/.test(_.last(this.scopes))
  }

  matchesScopeSelector(selector) {
    const targetClasses = selector.replace(StartDotRegex, '').split('.')
    _.any(this.scopes, (scope)=> {
      const scopeClasses = scope.split('.')
      _.isSubset(targetClasses, scopeClasses)
    });
  }
}
