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
    const editorInput = (e) => {
      const save = document.getElementById('save')

      if (editorState !== e.currentTarget.value) {
        save.classList.add('pulse')
        save.classList.remove('disabled')
      } else {
        save.classList.remove('pulse')
        save.classList.add('disabled')
      }
    }

    const editorFocus = () => {
      const link = document.getElementById('hyperlink')

      link.classList.remove('disabled')
    }

    const editorBlur = () => {
      const link = document.getElementById('hyperlink')

      link.classList.add('disabled')
    }

    const deleteClick = (e) => {
      const button = e.target

      button.innerHTML += 'Are you sure?'
      button.removeEventListener('click', deleteClick)
      button.addEventListener('click', confirmDelete)
    }

    const confirmDelete = (e) => {
      const id = document.getElementById('editor').dataset['noteId']
      const fileName = `C:\\notes\\${id}.json`
      const button = e.target

      fs.unlink(fileName, (err) => {
        if (err) {
          return
        }

        const editor = document.getElementById('editor')

        editor.value = ''
        editor.setAttribute('data-note-id', '')

        document.getElementById('title').value = ''
        document.getElementById('subtitle').value = ''

        button.innerHTML = button.innerHTML.replace(/Are you sure\?/g, '')
        button.removeEventListener('click', confirmDelete)
        button.addEventListener('click', deleteClick)

        document.getElementById('share').classList.add('disabled')
        document.getElementById('delete').classList.add('disabled')
        document.getElementById('title-text').innerHTML = `New Note`
        editor.focus()
      })
    }

    const saveClick = (e) => {
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

      const payload = {
        title: title,
        subtitle: subtitle,
        text: editorState,
        timestamp: new Date()
      }

      if (!noteId) {
        payload.noteId = uuid.v4()
        payload.favourite = false
      }

      const fileLocation = `C:\\notes\\${payload.noteId}.json`

      fs.writeFile(fileLocation, JSON.stringify(payload, null, 2), 'utf-8')

      textarea.focus()
      textarea.setAttribute('data-note-id', payload.noteId)

      button.classList.remove('pulse')
      button.classList.add('disabled')

      document.getElementById('delete').classList.remove('disabled')
      document.getElementById('title-text').innerHTML = `Editing ${title}`
    }

    document.getElementById('editor').addEventListener('input', editorInput)
    document.getElementById('editor').addEventListener('focus', editorFocus)
    document.getElementById('editor').addEventListener('blur', editorBlur)
    document.getElementById('delete').addEventListener('click', deleteClick)
    document.getElementById('save').addEventListener('click', saveClick)
  }
}
