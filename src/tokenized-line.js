const Token = require('./token')
const CommentScopeRegex = /(\b|\.)comment/

var idCounter = 1

module.exports = class TokenizedLine {
  constructor(properties) {
    this.id = idCounter++

    if (!properties) return

    ({
      openScopes: this.openScopes,
      text: this.text,
      tags: this.tags,
      ruleStack: this.ruleStack,
      tokenIterator: this.tokenIterator,
      grammar: this.grammar,
      tokens: this.cachedTokens
    } = properties)
  }

  getTokenIterator() {this.tokenIterator.reset(this)}

  get tokens() {
    if (this.cachedTokens)
      return this.cachedTokens
    else
      iterator = this.getTokenIterator()
      var tokens = []

      while (iterator.next())
        tokens.push(new Token({
          value: iterator.getText(),
          scopes: iterator.getScopes().slice()
        }))

      return tokens
  }

  tokenAtBufferColumn(bufferColumn) {
    this.tokens[this.tokenIndexAtBufferColumn(bufferColumn)]
  }

  tokenIndexAtBufferColumn(bufferColumn) {
    column = 0
    for (var index in this.tokens) {
      let token = this.tokens[index];
      column += token.value.length
      if (column > bufferColumn)
        return index
    }
    return index - 1
  }

  tokenStartColumnForBufferColumn(bufferColumn) {
    var delta = 0
    for (const token of this.tokens) {
      const nextDelta = delta + token.bufferDelta;
      if (nextDelta > bufferColumn)
        break;
      delta = nextDelta;
    }
    return delta
  }

  isComment() {
    if (typeof this.isCommentLine != 'undefined')
      return this.isCommentLine

    this.isCommentLine = false

    for (const tag of this.openScopes) {
      if (this.isCommentOpenTag(tag)) {
        this.isCommentLine = true
        return this.isCommentLine
      }
    }

    var startIndex = 0
    for (const tag of this.tags) {
      // If we haven't encountered any comment scope when reading the first
      // non-whitespace chunk of text, then we consider this as not being a
      // comment line.
      if (tag > 0) {
        if (!isWhitespaceOnly(this.text.substr(startIndex, tag)))
          break
        startIndex += tag
      }

      if (this.isCommentOpenTag(tag)) {
        this.isCommentLine = true
        return this.isCommentLine
      }
    }

    this.isCommentLine
  }

  isCommentOpenTag(tag) {
    if (tag < 0 && (tag & 1) == 1) {
      const scope = this.grammar.scopeForId(tag)
      if (CommentScopeRegex.test(scope))
        return true
    }
    return false
  }

  tokenAtIndex(index) {
    this.tokens[index]
  }

  getTokenCount() {
    count = 0
    for (const tag of this.tags) {
      if (tag >= 0)
        count++;
    }
    return count
  }
}

function isWhitespaceOnly(text) {
  for (char of text)
    if (char != '\t' && char != ' ')
      return false
  return true
}
