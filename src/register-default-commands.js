({ipcRenderer} = require('electron'))
Grim = require('grim')


module.exports = ({commandRegistry, commandInstaller, config, notificationManager, project, clipboard}) => {
  commandRegistry.add(
    'atom-workspace',
    {
      'pane:show-next-recently-used-item':                ()=>{this.getModel().getActivePane().activateNextRecentlyUsedItem()},
      'pane:show-previous-recently-used-item':            ()=>{this.getModel().getActivePane().activatePreviousRecentlyUsedItem()},
      'pane:move-active-item-to-top-of-stack':            ()=>{this.getModel().getActivePane().moveActiveItemToTopOfStack()},
      'pane:show-next-item':                              ()=>{this.getModel().getActivePane().activateNextItem()},
      'pane:show-previous-item':                          ()=>{this.getModel().getActivePane().activatePreviousItem()},
      'pane:show-item-1':                                 ()=>{this.getModel().getActivePane().activateItemAtIndex(0)},
      'pane:show-item-2':                                 ()=>{this.getModel().getActivePane().activateItemAtIndex(1)},
      'pane:show-item-3':                                 ()=>{this.getModel().getActivePane().activateItemAtIndex(2)},
      'pane:show-item-4':                                 ()=>{this.getModel().getActivePane().activateItemAtIndex(3)},
      'pane:show-item-5':                                 ()=>{this.getModel().getActivePane().activateItemAtIndex(4)},
      'pane:show-item-6':                                 ()=>{this.getModel().getActivePane().activateItemAtIndex(5)},
      'pane:show-item-7':                                 ()=>{this.getModel().getActivePane().activateItemAtIndex(6)},
      'pane:show-item-8':                                 ()=>{this.getModel().getActivePane().activateItemAtIndex(7)},
      'pane:show-item-9':                                 ()=>{this.getModel().getActivePane().activateLastItem()},
      'pane:move-item-right':                             ()=>{this.getModel().getActivePane().moveItemRight()},
      'pane:move-item-left':                              ()=>{this.getModel().getActivePane().moveItemLeft()},
      'window:increase-font-size':                        ()=>{this.getModel().increaseFontSize()},
      'window:decrease-font-size':                        ()=>{this.getModel().decreaseFontSize()},
      'window:reset-font-size':                           ()=>{this.getModel().resetFontSize()},
      'application:about':                                ()=>{ipcRenderer.send('command', 'application:about')},
      'application:show-preferences':                     ()=>{ipcRenderer.send('command', 'application:show-settings')},
      'application:show-settings':                        ()=>{ipcRenderer.send('command', 'application:show-settings')},
      'application:quit':                                 ()=>{ipcRenderer.send('command', 'application:quit')},
      'application:hide':                                 ()=>{ipcRenderer.send('command', 'application:hide')},
      'application:hide-other-applications':              ()=>{ipcRenderer.send('command', 'application:hide-other-applications')},
      'application:install-update':                       ()=>{ipcRenderer.send('command', 'application:install-update')},
      'application:unhide-all-applications':              ()=>{ipcRenderer.send('command', 'application:unhide-all-applications')},
      'application:new-window':                           ()=>{ipcRenderer.send('command', 'application:new-window')},
      'application:new-file':                             ()=>{ipcRenderer.send('command', 'application:new-file')},
      'application:open':                                 ()=>{ipcRenderer.send('open-chosen-any',    getBestContextPath())},
      'application:open-file':                            ()=>{ipcRenderer.send('open-chosen-file',   getBestContextPath())},
      'application:open-folder':                          ()=>{ipcRenderer.send('open-chosen-folder', getBestContextPath())},
      'application:open-dev':                             ()=>{ipcRenderer.send('command', 'application:open-dev')},
      'application:open-safe':                            ()=>{ipcRenderer.send('command', 'application:open-safe')},
      'application:add-project-folder':                   ()=>{atom.addProjectFolder()},
      'application:minimize':                             ()=>{ipcRenderer.send('command', 'application:minimize')},
      'application:zoom':                                 ()=>{ipcRenderer.send('command', 'application:zoom')},
      'application:bring-all-windows-to-front':           ()=>{ipcRenderer.send('command', 'application:bring-all-windows-to-front')},
      'application:open-your-config':                     ()=>{ipcRenderer.send('command', 'application:open-your-config')},
      'application:open-your-init-script':                ()=>{ipcRenderer.send('command', 'application:open-your-init-script')},
      'application:open-your-keymap':                     ()=>{ipcRenderer.send('command', 'application:open-your-keymap')},
      'application:open-your-snippets':                   ()=>{ipcRenderer.send('command', 'application:open-your-snippets')},
      'application:open-your-stylesheet':                 ()=>{ipcRenderer.send('command', 'application:open-your-stylesheet')},
      'application:open-license':                         ()=>{this.getModel().openLicense()},
      'window:run-package-specs':                         ()=>{this.runPackageSpecs()},
      'window:run-benchmarks':                            ()=>{this.runBenchmarks()},
      'window:toggle-left-dock':                          ()=>{this.getModel().getLeftDock().toggle()},
      'window:toggle-right-dock':                         ()=>{this.getModel().getRightDock().toggle()},
      'window:toggle-bottom-dock':                        ()=>{this.getModel().getBottomDock().toggle()},
      'window:focus-next-pane':                           ()=>{this.getModel().activateNextPane()},
      'window:focus-previous-pane':                       ()=>{this.getModel().activatePreviousPane()},
      'window:focus-pane-above':                          ()=>{this.focusPaneViewAbove()},
      'window:focus-pane-below':                          ()=>{this.focusPaneViewBelow()},
      'window:focus-pane-on-left':                        ()=>{this.focusPaneViewOnLeft()},
      'window:focus-pane-on-right':                       ()=>{this.focusPaneViewOnRight()},
      'window:move-active-item-to-pane-above':            ()=>{this.moveActiveItemToPaneAbove()},
      'window:move-active-item-to-pane-below':            ()=>{this.moveActiveItemToPaneBelow()},
      'window:move-active-item-to-pane-on-left':          ()=>{this.moveActiveItemToPaneOnLeft()},
      'window:move-active-item-to-pane-on-right':         ()=>{this.moveActiveItemToPaneOnRight()},
      'window:copy-active-item-to-pane-above':            ()=>{this.moveActiveItemToPaneAbove({keepOriginal: true})},
      'window:copy-active-item-to-pane-below':            ()=>{this.moveActiveItemToPaneBelow({keepOriginal: true})},
      'window:copy-active-item-to-pane-on-left':          ()=>{this.moveActiveItemToPaneOnLeft({keepOriginal: true})},
      'window:copy-active-item-to-pane-on-right':         ()=>{this.moveActiveItemToPaneOnRight({keepOriginal: true})},
      'window:save-all':                                  ()=>{this.getModel().saveAll()},
      'window:toggle-invisibles':                         ()=>{config.set("editor.showInvisibles", ! config.get("editor.showInvisibles"))},
      'window:log-deprecation-warnings':                  ()=>{Grim.logDeprecations()},
      'window:toggle-auto-indent':                        ()=>{config.set("editor.autoIndent", ! config.get("editor.autoIndent"))},
      'pane:reopen-closed-item':                          ()=>{this.getModel().reopenItem()},
      'core:close':                                       ()=>{this.getModel().closeActivePaneItemOrEmptyPaneOrWindow()},
      'core:save':                                        ()=>{this.getModel().saveActivePaneItem()},
      'core:save-as':                                     ()=>{this.getModel().saveActivePaneItemAs()}
    },
    false
  )
  
  if (process.platform == 'darwin') {
    commandRegistry.add(
      'atom-workspace',
      'window:install-shell-commands',
      (()=> commandInstaller.installShellCommandsInteractively()),
      false
    )
  }
  
  commandRegistry.add(
    'atom-pane',
    {
      'pane:save-items':                                  ()=>{this.getModel().saveItems()},
      'pane:split-left':                                  ()=>{this.getModel().splitLeft()},
      'pane:split-right':                                 ()=>{this.getModel().splitRight()},
      'pane:split-up':                                    ()=>{this.getModel().splitUp()},
      'pane:split-down':                                  ()=>{this.getModel().splitDown()},
      'pane:split-left-and-copy-active-item':             ()=>{this.getModel().splitLeft({copyActiveItem: true})},
      'pane:split-right-and-copy-active-item':            ()=>{this.getModel().splitRight({copyActiveItem: true})},
      'pane:split-up-and-copy-active-item':               ()=>{this.getModel().splitUp({copyActiveItem: true})},
      'pane:split-down-and-copy-active-item':             ()=>{this.getModel().splitDown({copyActiveItem: true})},
      'pane:split-left-and-move-active-item':             ()=>{this.getModel().splitLeft({moveActiveItem: true})},
      'pane:split-right-and-move-active-item':            ()=>{this.getModel().splitRight({moveActiveItem: true})},
      'pane:split-up-and-move-active-item':               ()=>{this.getModel().splitUp({moveActiveItem: true})},
      'pane:split-down-and-move-active-item':             ()=>{this.getModel().splitDown({moveActiveItem: true})},
      'pane:close':                                       ()=>{this.getModel().close()},
      'pane:close-other-items':                           ()=>{this.getModel().destroyInactiveItems()},
      'pane:increase-size':                               ()=>{this.getModel().increaseSize()},
      'pane:decrease-size':                               ()=>{this.getModel().decreaseSize()}
    },
    false
  )
  
  commandRegistry.add(
    'atom-text-editor',
    stopEventPropagation({
      'core:move-left':                                   ()=>{this.moveLeft()},
      'core:move-right':                                  ()=>{this.moveRight()},
      'core:select-left':                                 ()=>{this.selectLeft()},
      'core:select-right':                                ()=>{this.selectRight()},
      'core:select-up':                                   ()=>{this.selectUp()},
      'core:select-down':                                 ()=>{this.selectDown()},
      'core:select-all':                                  ()=>{this.selectAll()},
      'editor:select-word':                               ()=>{this.selectWordsContainingCursors()},
      'editor:consolidate-selections':               (event)=>{if (!this.consolidateSelections()) event.abortKeyBinding()},
      'editor:move-to-beginning-of-next-paragraph':       ()=>{this.moveToBeginningOfNextParagraph()},
      'editor:move-to-beginning-of-previous-paragraph':   ()=>{this.moveToBeginningOfPreviousParagraph()},
      'editor:move-to-beginning-of-screen-line':          ()=>{this.moveToBeginningOfScreenLine()},
      'editor:move-to-beginning-of-line':                 ()=>{this.moveToBeginningOfLine()},
      'editor:move-to-end-of-screen-line':                ()=>{this.moveToEndOfScreenLine()},
      'editor:move-to-end-of-line':                       ()=>{this.moveToEndOfLine()},
      'editor:move-to-first-character-of-line':           ()=>{this.moveToFirstCharacterOfLine()},
      'editor:move-to-beginning-of-word':                 ()=>{this.moveToBeginningOfWord()},
      'editor:move-to-end-of-word':                       ()=>{this.moveToEndOfWord()},
      'editor:move-to-beginning-of-next-word':            ()=>{this.moveToBeginningOfNextWord()},
      'editor:move-to-previous-word-boundary':            ()=>{this.moveToPreviousWordBoundary()},
      'editor:move-to-next-word-boundary':                ()=>{this.moveToNextWordBoundary()},
      'editor:move-to-previous-subword-boundary':         ()=>{this.moveToPreviousSubwordBoundary()},
      'editor:move-to-next-subword-boundary':             ()=>{this.moveToNextSubwordBoundary()},
      'editor:select-to-beginning-of-next-paragraph':     ()=>{this.selectToBeginningOfNextParagraph()},
      'editor:select-to-beginning-of-previous-paragraph': ()=>{this.selectToBeginningOfPreviousParagraph()},
      'editor:select-to-end-of-line':                     ()=>{this.selectToEndOfLine()},
      'editor:select-to-beginning-of-line':               ()=>{this.selectToBeginningOfLine()},
      'editor:select-to-end-of-word':                     ()=>{this.selectToEndOfWord()},
      'editor:select-to-beginning-of-word':               ()=>{this.selectToBeginningOfWord()},
      'editor:select-to-beginning-of-next-word':          ()=>{this.selectToBeginningOfNextWord()},
      'editor:select-to-next-word-boundary':              ()=>{this.selectToNextWordBoundary()},
      'editor:select-to-previous-word-boundary':          ()=>{this.selectToPreviousWordBoundary()},
      'editor:select-to-next-subword-boundary':           ()=>{this.selectToNextSubwordBoundary()},
      'editor:select-to-previous-subword-boundary':       ()=>{this.selectToPreviousSubwordBoundary()},
      'editor:select-to-first-character-of-line':         ()=>{this.selectToFirstCharacterOfLine()},
      'editor:select-line':                               ()=>{this.selectLinesContainingCursors()},
      'editor:select-larger-syntax-node':                 ()=>{this.selectLargerSyntaxNode()},
      'editor:select-smaller-syntax-node':                ()=>{this.selectSmallerSyntaxNode()}
    }),
    false
  )
  
  commandRegistry.add(
    'atom-text-editor:not([readonly])',
    stopEventPropagation({
      'core:undo':                                        ()=>{this.undo()},
      'core:redo':                                        ()=>{this.redo()}
    }),
    false
  )
  
  commandRegistry.add(
    'atom-text-editor',
    stopEventPropagationAndGroupUndo(
      config,
      {
        'core:copy':                                      ()=>{this.copySelectedText()},
        'editor:copy-selection':                          ()=>{this.copyOnlySelectedText()}
      }
    ),
    false
  )
  
  commandRegistry.add(
    'atom-text-editor:not([readonly])',
    stopEventPropagationAndGroupUndo(
      config,
      {
        'core:backspace':                                 ()=>{this.backspace()},
        'core:delete':                                    ()=>{this.delete()},
        'core:cut':                                       ()=>{this.cutSelectedText()},
        'core:paste':                                     ()=>{this.pasteText()},
        'editor:paste-without-reformatting':              ()=>{this.pasteText({
                                                             normalizeLineEndings: false,
                                                             autoIndent: false,
                                                             preserveTrailingLineIndentation: true
                                                          })},
        'editor:delete-to-previous-word-boundary':        ()=>{this.deleteToPreviousWordBoundary()},
        'editor:delete-to-next-word-boundary':            ()=>{this.deleteToNextWordBoundary()},
        'editor:delete-to-beginning-of-word':             ()=>{this.deleteToBeginningOfWord()},
        'editor:delete-to-beginning-of-line':             ()=>{this.deleteToBeginningOfLine()},
        'editor:delete-to-end-of-line':                   ()=>{this.deleteToEndOfLine()},
        'editor:delete-to-end-of-word':                   ()=>{this.deleteToEndOfWord()},
        'editor:delete-to-beginning-of-subword':          ()=>{this.deleteToBeginningOfSubword()},
        'editor:delete-to-end-of-subword':                ()=>{this.deleteToEndOfSubword()},
        'editor:delete-line':                             ()=>{this.deleteLine()},
        'editor:cut-to-end-of-line':                      ()=>{this.cutToEndOfLine()},
        'editor:cut-to-end-of-buffer-line':               ()=>{this.cutToEndOfBufferLine()},
        'editor:transpose':                               ()=>{this.transpose()},
        'editor:upper-case':                              ()=>{this.upperCase()},
        'editor:lower-case':                              ()=>{this.lowerCase()},
      }
    ),
    false
  )
  
  commandRegistry.add(
    'atom-text-editor:not([mini])',
    stopEventPropagation({
      'core:move-up':                                     ()=>{this.moveUp()},
      'core:move-down':                                   ()=>{this.moveDown()},
      'core:move-to-top':                                 ()=>{this.moveToTop()},
      'core:move-to-bottom':                              ()=>{this.moveToBottom()},
      'core:page-up':                                     ()=>{this.pageUp()},
      'core:page-down':                                   ()=>{this.pageDown()},
      'core:select-to-top':                               ()=>{this.selectToTop()},
      'core:select-to-bottom':                            ()=>{this.selectToBottom()},
      'core:select-page-up':                              ()=>{this.selectPageUp()},
      'core:select-page-down':                            ()=>{this.selectPageDown()},
      'editor:add-selection-below':                       ()=>{this.addSelectionBelow()},
      'editor:add-selection-above':                       ()=>{this.addSelectionAbove()},
      'editor:split-selections-into-lines':               ()=>{this.splitSelectionsIntoLines()},
      'editor:toggle-soft-tabs':                          ()=>{this.toggleSoftTabs()},
      'editor:toggle-soft-wrap':                          ()=>{this.toggleSoftWrapped()},
      'editor:fold-all':                                  ()=>{this.foldAll()},
      'editor:unfold-all':                                ()=>{this.unfoldAll()},
      'editor:fold-current-row':                          ()=>{
                                                            this.foldCurrentRow()
                                                            this.scrollToCursorPosition()
                                                          },
      'editor:unfold-current-row':                        ()=>{
                                                            this.unfoldCurrentRow()
                                                            this.scrollToCursorPosition()
                                                          },
      'editor:fold-selection':                            ()=>{this.foldSelectedLines()},
      'editor:fold-at-indent-level-1':                    ()=>{
                                                            this.foldAllAtIndentLevel(0)
                                                            this.scrollToCursorPosition()
                                                          },
      'editor:fold-at-indent-level-2':                    ()=>{
                                                            this.foldAllAtIndentLevel(1)
                                                            this.scrollToCursorPosition()
                                                          },
      'editor:fold-at-indent-level-3':                    ()=>{
                                                            this.foldAllAtIndentLevel(2)
                                                            this.scrollToCursorPosition()
                                                          },
      'editor:fold-at-indent-level-4':                    ()=>{
                                                            this.foldAllAtIndentLevel(3)
                                                            this.scrollToCursorPosition()
                                                          },
      'editor:fold-at-indent-level-5':                    ()=>{
                                                            this.foldAllAtIndentLevel(4)
                                                            this.scrollToCursorPosition()
                                                          },
      'editor:fold-at-indent-level-6':                    ()=>{
                                                            this.foldAllAtIndentLevel(5)
                                                            this.scrollToCursorPosition()
                                                          },
      'editor:fold-at-indent-level-7':                    ()=>{
                                                            this.foldAllAtIndentLevel(6)
                                                            this.scrollToCursorPosition()
                                                          },
      'editor:fold-at-indent-level-8':                    ()=>{
                                                            this.foldAllAtIndentLevel(7)
                                                            this.scrollToCursorPosition()
                                                          },
      'editor:fold-at-indent-level-9':                    ()=>{
                                                            this.foldAllAtIndentLevel(8)
                                                            this.scrollToCursorPosition()
                                                          },
      'editor:log-cursor-scope':                          ()=>{showCursorScope(this.getCursorScope(), notificationManager)},
      'editor:log-cursor-syntax-tree-scope':              ()=>{showSyntaxTree(this.getCursorSyntaxTreeScope(), notificationManager)},
      'editor:copy-path':                                 ()=>{copyPathToClipboard(this, project, clipboard, false)},
      'editor:copy-project-path':                         ()=>{copyPathToClipboard(this, project, clipboard, true)},
      'editor:toggle-indent-guide':                       ()=>{config.set('editor.showIndentGuide', ! config.get('editor.showIndentGuide'))},
      'editor:toggle-line-numbers':                       ()=>{config.set('editor.showLineNumbers', ! config.get('editor.showLineNumbers'))},
      'editor:scroll-to-cursor':                          ()=>{this.scrollToCursorPosition()},
    }),
    false
  )

  commandRegistry.add(
    'atom-text-editor:not([mini]):not([readonly])',
    stopEventPropagationAndGroupUndo(
      config,
      {
        'editor:indent':                                  ()=>{this.indent()},
        'editor:auto-indent':                             ()=>{this.autoIndentSelectedRows()},
        'editor:indent-selected-rows':                    ()=>{this.indentSelectedRows()},
        'editor:outdent-selected-rows':                   ()=>{this.outdentSelectedRows()},
        'editor:newline':                                 ()=>{this.insertNewline()},
        'editor:newline-below':                           ()=>{this.insertNewlineBelow()},
        'editor:newline-above':                           ()=>{this.insertNewlineAbove()},
        'editor:toggle-line-comments':                    ()=>{this.toggleLineCommentsInSelection()},
        'editor:checkout-head-revision':                  ()=>{atom.workspace.checkoutHeadRevision(this)},
        'editor:move-line-up':                            ()=>{this.moveLineUp()},
        'editor:move-line-down':                          ()=>{this.moveLineDown()},
        'editor:move-selection-left':                     ()=>{this.moveSelectionLeft()},
        'editor:move-selection-right':                    ()=>{this.moveSelectionRight()},
        'editor:duplicate-lines':                         ()=>{this.duplicateLines()},
        'editor:join-lines':                              ()=>{this.joinLines()}
      }
    ),
    false
  )
}

stopEventPropagation = (commandListeners) => {
  var newCommandListeners = {}
  for (const commandName in commandListeners) {
    const commandListener = commandListeners[commandName];
    newCommandListeners[commandName] = (event) => {
      event.stopPropagation()
      commandListener.call(this.getModel(), event)
    }
  }
  return newCommandListeners
}

stopEventPropagationAndGroupUndo = (config, commandListeners) => {
  var newCommandListeners = {}
  for (const commandName in commandListeners) {
    const commandListener = commandListeners[commandName];
    newCommandListeners[commandName] = (event) => {
      event.stopPropagation()
      model = this.getModel()
      model.transact( model.getUndoGroupingInterval(), () => {commandListener.call(model, event)})
    }
  }
  return newCommandListeners
}

showCursorScope = (descriptor, notificationManager) => {
  var list = descriptor.scopes.toString().split(',')
  list = list.map((item) => {return `* ${item}`})
  const content = `Scopes at Cursor\n${list.join('\n')}`

  notificationManager.addInfo(content, {dismissable: true})
}

showSyntaxTree = (descriptor, notificationManager) => {
  var list = descriptor.scopes.toString().split(',')
  // list = list.map( (item) => {return `* ${item}`})
  const content = `Syntax tree at Cursor\n${list.join('\n')}`

  notificationManager.addInfo(content, {dismissable: true})
}

copyPathToClipboard = (editor, project, clipboard, relative) => {
  var filePath = editor.getPath()
  if (filePath) {
    if (relative) filePath = project.relativize(filePath)
    clipboard.write(filePath)
  }
}

getBestContextPath = () => {
  if (atom.workspace.getActiveTextEditor())
    return atom.workspace.getActiveTextEditor().getPath()
  if (atom.project.getPaths())
    return atom.project.getPaths()[0]
  return undefined
}
