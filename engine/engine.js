const fs = require('fs')

module.exports = {
  newPage: (exports) => {
    return new Page(exports)
  },

  setActiveButton: (id) => {
    Array.prototype.slice.call(document.getElementsByClassName('dropdown')).forEach((button) => button.classList.remove('active'))
    document.getElementById(id).classList.add('active')
  },

  newComponent: (exports, params) => {
    return new Promise((resolve, reject) => {
      // Otherwise, we load the HTML data from the template.
      const templateLocation = exports.getTemplate()

      // Load the HTML from the template.
      loadTemplate(templateLocation, exports).then((template) => {
        // Using the export of the component, the parameters and
        // template. We create a new instance of the Component
        // class.
        const component = new Component(exports, params, template.trim())

        return resolve(component)
      })
    })
  },

  getConfiguration: () => {
    return new Promise((resolve, reject) => {
      fs.readFile('C:\\notes\\config.json', 'utf-8', (err, data) => {
        if (err) {
          reject(err)
        }

        const obj = JSON.parse(data)
        const config = new Configuration(obj)

        resolve(config)
      })
    })
  }
}

function Configuration (config) {
  for (const property in config) {
    this[property] = config[property]
  }

  this.get = (key) => {
    const value = this[key]

    return value || ''
  }
}

/**
 * A page is an object which represents a page of the application.
 * It has similar functionality to a component. However, it stores a list
 * of sub-components which are rendered in a FIFO manner.
 * @param {object} exports The page's module export.
 */
function Page (exports) {
  this.components = []
  this.exports = exports

  /**
   * Adds a component to be rendered onto the page.
   * @param {object} component  The module export of the component.
   * @param {string} id         The component's HTML identifier.
   * @param {string} parent     The component's parent identifier.
  */
  this.addComponent = (component, id, parent) => {
    this.components.push({cmp: component, id: id, parent: parent})
  }

  /**
   * Renders this component. Removing any existing pages in the process.
  */
  this.render = () => {
    return new Promise((resolve, reject) => {
      const pages = Array.prototype.slice.call(document.getElementsByTagName('page'))

      if (pages.length) {
        pages.forEach((page) => {
          page.parentElement.removeChild(page)
        })
      }

      const actions = this.components.map((container) => {
        return new Promise((resolve) => {
          container.cmp.render(container.parent, container.id)
          container.cmp.execute()
          resolve()
        })
      })

      Promise.all(actions).then(() => resolve())
    })
  }
}

/**
 * A component is an object which represents a feature of the
 * application. They contain the HTML and script required for
 * them to be rendered to the browser window.
 * @param {object} exports      The module export of the component.
 * @param {object} params       The component parameters.
 * @param {string} template     The component template.
 */
function Component (exports, params, template) {
  this.exports = exports
  this.params = params
  this.template = template

  /**
   * Uses the given parameters and template to create a HTML
   * DOM element which can be injected into a parent class.
   * @param {string} parentId     The identifier of the component element.
   * @param {string} thisId      The identifier of the component.
   */
  this.render = (parentId, thisId) => {
    this.id = thisId

    // Create a copy of the template so we can reuse this component
    // later.
    let temp = this.template

    // If we have parameters, replace any substrings of the template containing
    // the parameter name in braces. For example, <div>{text}</div> combined with
    // a parameter object as { text: "test" } will produce an HTML output of
    // <div>test</div>
    if (this.params) {
      for (let property in this.params) {
        if (this.params.hasOwnProperty(property) && typeof (params[property]) !== 'function') {
          temp = temp.replace(`{${property}}`, this.params[property])
        }
      }
    }

    // Obtain the parent and create a contextual
    // DOM fragment for our new component.
    const parent = document.getElementById(parentId)

    const dom = document.createRange().createContextualFragment(temp)
    const html = dom.firstChild

    html.setAttribute('data-cmp', this.exports.getName())

    // Set our id, inject any required stylesheets and append
    // the component to the parent.
    html.id = thisId

    this.injectStyleSheets()
    parent.appendChild(dom)
  }

  /**
   * Executes any scripts that the component may depend on.
   * This should be stored in the export module of the component
   * as a method named 'execute'. This method should optionally
   * take any neccessary parameters required to execute the component
   * script.
   * @param {object} params The parameters required to execute this component.
   */
  this.execute = (params) => {
    this.exports.execute(params)
  }

  /**
   * Injects the stylesheets required by this component into the
   * <head> portion of the document. A check is performed to ensure that
   * duplicate stylesheets are not injected into the HTML.
   */
  this.injectStyleSheets = () => {
    // Get the stylesheet location and determine if it
    // has previously been loaded.
    const styleSheet = this.exports.getStyleSheet()
    const exists = globalStyleSheets.some((sheet) => {
      return sheet === styleSheet
    })

    // If it hasn't, create a new <link> element with the
    // required information and append it to the <head>
    // element of the document.
    if (!exists) {
      const link = document.createElement('link')

      link.type = 'text/css'
      link.rel = 'stylesheet'
      link.href = styleSheet
      document.head.appendChild(link)

      globalStyleSheets.push(styleSheet)
    }
  }
}

const globalStyleSheets = []
const loadedTemplates = []

function loadTemplate (url, exports) {
  return new Promise((resolve, reject) => {
    // Use the component name to determine if we have loaded this
    // component previously.
    const name = exports.getName()

    const findResult = loadedTemplates.find((elem) => {
      return elem.id === name
    })

    // If so, use the already created component object but
    // switch the previous parameters for the ones given.
    if (findResult) {
      return resolve(findResult.template)
    }

    fs.readFile(url, 'utf-8', (err, tmp) => {
      if (err) {
        return reject(err)
      }

      // Check if this template has been loaded previously.
      const exists = loadedTemplates.some((elem) => {
        return elem.id === exports.getName()
      })

      // If it hasn't append it to the array of loaded templates
      // for later use.
      if (!exists) {
        loadedTemplates.push({
          id: exports.getName(),
          template: tmp.trim()
        })
      }

      resolve(tmp)
    })
  })
}
