const path = require('path')
const engine = require('../../engine/engine.js')
const note = require('../../components/note/note.js')
const fs = require('fs')

module.exports = {
  getTemplate: () => path.join(__dirname, 'notes.html'),
  getStyleSheet: () => path.join(__dirname, 'notes.css'),
  getName: () => 'notes',

  execute: () => {
    engine.setActiveButton('notes')

    getFiles().then((files) => {
      files.forEach((file) => {
        engine.newComponent(note, file).then((cmp) => {
          cmp.render('note-list', file.noteId)
          cmp.execute({id: file.noteId, fav: file.favourite})
        })
      })
    })
  },

  getPage: () => {
    return createPage()
  }
}

function createPage () {
  return new Promise((resolve) => {
    const page = engine.newPage(module.exports)

    engine.newComponent(module.exports, null).then((cmp) => {
      page.addComponent(cmp, 'notes', 'content')

      resolve(page)
    })
  })
}

function readFile (fileName, files) {
  return new Promise((resolve, reject) => {
    const fileDir = `C:\\notes\\${fileName}`

    fs.readFile(fileDir, 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      }

      const obj = JSON.parse(data, (key, value) => {
        if (key === 'text') {
          return ''
        }

        if (key === 'timestamp') {
          return new Date(Date.parse(value))
        }

        return value
      })

      files.push(obj)

      resolve(files)
    })
  })
}

function getFiles () {
  return new Promise((resolve, reject) => {
    fs.readdir('C:\\notes', (err, files) => {
      if (err) {
        reject(err)
      }

      let ret = []

      const actions = files.map((file) => {
        return new Promise((resolve) => {
          readFile(file, ret).then((arr) => {
            resolve(arr)
          })
        })
      })

      Promise.all(actions).then((result) => {
        const sorted = ret.sort((a, b) => {
          if (a.timestamp < b.timestamp) {
            return 1
          }

          if (a.timestamp > b.timestamp) {
            return -1
          }

          return 0
        })

        const cleansed = sorted.map((file) => {
          file.timestamp = new Date(file.timestamp).toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '')

          return file
        })

        resolve(cleansed)
      })
    })
  })
}
