const path = require('path')
const engine = require('../../engine/engine.js')
const modal = require('../modal/modal.js')
const fs = require('fs')
const uuid = require('uuid')

let editorState = ''

module.exports = {
  getTemplate: () => path.join(__dirname, 'editor.html'),
  getStyleSheet: () => path.join(__dirname, 'editor.css'),
  getName: () => 'editor',

  execute: () => {
    document.getElementById('editor').addEventListener('input', (e) => {
      const save = document.getElementById('save')

      if (editorState !== e.currentTarget.value) {
        save.classList.add('pulse')
        save.classList.remove('disabled')
      } else {
        save.classList.remove('pulse')
        save.classList.add('disabled')
      }
    })

    document.getElementById('editor').addEventListener('focus', () => {
      const link = document.getElementById('hyperlink')

      link.classList.remove('disabled')
    })

    document.getElementById('editor').addEventListener('blur', () => {
      const link = document.getElementById('hyperlink')

      link.classList.add('disabled')
    })

    document.getElementById('delete').addEventListener('click', (e) => {
      const button = e.currentTarget

      button.innerHTML += 'Are you sure?'
      button.id = 'delete-confirm'

      document.getElementById('delete-confirm').addEventListener('click', (e) => {
        const id = document.getElementById('editor').dataset['noteId']
        const fileName = `C:\\notes\\${id}.json`

        fs.unlink(fileName, (err) => {
          if (err) {
            return
          }

          const editor = document.getElementById('editor')

          editor.value = ''
          editor.setAttribute('data-note-id', '')

          document.getElementById('title').value = ''
          document.getElementById('subtitle').value = ''

          e.target.id = 'delete'
          e.target.innerHTML = e.target.innerHTML.replace(/Are you sure\?/g, '')

          document.getElementById('share').classList.add('disabled')
          document.getElementById('delete').classList.add('disabled')
          editor.focus()
        })
      })
    })

    document.getElementById('save').addEventListener('click', (e) => {
      const textarea = document.getElementById('editor')
      const title = document.getElementById('title').value
      const subtitle = document.getElementById('subtitle').value
      const button = e.currentTarget
      let noteId = textarea.dataset['noteId']

      if (title === '') {
        engine.newComponent(modal, {
          header: 'Could not save note',
          text: 'Please provide a title for your note.',
          icon: 'warning circle',
          id: 'error-modal'
        }).then((cmp) => {
          cmp.render('content', '')
          cmp.execute({id: 'error-modal'})
        })

        return
      }

      editorState = textarea.value

      if (!noteId) {
        noteId = uuid.v4()
      }

      const payload = {
        title: title,
        subtitle: subtitle,
        text: editorState,
        timestamp: new Date(),
        noteId: noteId
      }

      const fileLocation = `C:\\notes\\${payload.noteId}.json`

      fs.writeFile(fileLocation, JSON.stringify(payload, null, 2), 'utf-8')

      textarea.focus()
      textarea.setAttribute('data-note-id', payload.noteId)

      button.classList.remove('pulse')
      button.classList.add('disabled')

      document.getElementById('delete').classList.remove('disabled')
    })
  }
}
