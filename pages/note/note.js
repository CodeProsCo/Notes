const path = require('path')
const engine = require('../../engine/engine.js')
const editor = require('../../components/editor/editor.js')
const metadata = require('../../components/metadata/metadata.js')

module.exports = {
  getTemplate: () => path.join(__dirname, 'note.html'),
  getStyleSheet: () => path.join(__dirname, 'note.css'),
  getName: () => 'note',

  execute: (params) => {
    engine.setActiveButton('new-file')
  },

  getPage: () => {
    return createPage().then((page) => createNoteEditor(page)).then((page) => createMetadataEditor(page))
  }
}

function createPage () {
  return new Promise((resolve) => {
    const page = engine.newPage(module.exports)

    engine.newComponent(module.exports, null).then((cmp) => {
      page.addComponent(cmp, 'note', 'content')

      resolve(page)
    })
  })
}

function createNoteEditor (page) {
  return new Promise((resolve, reject) => {
    engine.newComponent(editor).then((component) => {
      page.addComponent(component, '', 'note-editor')

      resolve(page)
    })
  })
}

function createMetadataEditor (page) {
  return new Promise((resolve, reject) => {
    engine.newComponent(metadata).then((component) => {
      page.addComponent(component, '', 'metadata-editor')

      resolve(page)
    })
  })
}
