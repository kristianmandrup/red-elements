import {
  RED,
  readPage,
  ctx as baseCtx,
  Editor
} from './imports'

// use instances from red-runtime
// inject RED singleton instead
let nodes = {}
let events = {
  on() {}
}
let actions = {
  add() {}
}

let ctx = Object.assign({
  actions,
  // keyboard,
  // utils,
  events,
  // settings,
  nodes,
  // view
}, baseCtx)


function create(ctx) {
  return new Editor(ctx)
}


let editor
beforeEach(() => {
  editor = create(ctx)
})

beforeAll(() => {
  // widgets that need to be available
  // EditableList(RED)

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('editor', __dirname)
})

test('Editor: create', () => {
  expect(editor.editStack).toEqual([])
})

test('Editor: getCredentialsURL', () => {
  let url = editor.getCredentialsURL('a b', 'x')
  expect(url).toBe('credentials/a-b/x')
})

test('Editor: validateNode', () => {
  // TODO: use real (or better mock) node
  let node = {
    id: 'x'
  }
  let valid = editor.validateNode(node)
  expect(valid).toBeTruthy()
})

test('Editor: validateNodeProperties', () => {
  let node = {
    id: 'x'
  }
  let definition = {}
  let properties = {}
  let valid = editor.validateNodeProperties(node, definition, properties)
  expect(valid).toBeTruthy()
})

test('Editor: validateNodeProperty', () => {
  let node = {
    id: 'x'
  }
  let definition = {}
  let properties = {}
  let value = 'a'
  let valid = editor.validateNodeProperty(node, definition, property, value)
  expect(valid).toBeTruthy()
})

test('Editor: validateNodeEditor', () => {
  let node = {
    id: 'x'
  }
  let prefix = 'a'
  let valid = editor.validateNodeEditor(node, prefix)
  expect(valid).toBeTruthy()
})

test('Editor: validateNodeEditorProperty', () => {
  let node = {
    id: 'x'
  }
  let defaults = {}
  let property = {}
  let prefix = 'a'
  let valid = editor.validateNodeEditorProperty(node, defaults, property, prefix)
  expect(valid).toBeTruthy()
})

test('Editor: updateNodeProperties', () => {
  let node = {
    id: 'x'
  }
  let output = {}
  let removedLinks = editor.updateNodeProperties(node, outputMap)
  expect(removedLinks).toBeTruthy()
})

test('Editor: prepareConfigNodeSelect', () => {
  let node = {
    id: 'x'
  }
  let type = 'io'
  let property = {}
  let prefix = 'a'
  let prepared = editor.prepareConfigNodeSelect(node, property, type, prefix)
  expect(prepared).toBeTruthy()
})

test('Editor: prepareConfigNodeButton', () => {

  let node = {
    id: 'x'
  }
  let type = 'io'
  let property = {}
  let prefix = 'a'
  let prepared = editor.prepareConfigNodeButton(node, property, type, prefix)
  expect(prepared).toBeTruthy()
})

test('Editor: preparePropertyEditor', () => {

  let node = {
    id: 'x'
  }
  let definition = {}
  let property = {}
  let prefix = 'a'
  let prepared = editor.preparePropertyEditor(node, property, prefix, definition)
  expect(prepared).toBeTruthy()
})

test('Editor: attachPropertyChangeHandler', () => {

  let node = {
    id: 'x'
  }
  let definition = {}
  let property = {}
  let prefix = 'a'
  let prepared = editor.attachPropertyChangeHandler(node, definition, property, prefix)
  expect(prepared).toBeTruthy()
})

test('Editor: populateCredentialsInputs', () => {

  let node = {
    id: 'x'
  }
  let credDef = {}
  let credData = {}
  let prefix = 'a'
  editor.populateCredentialsInputs(node, credDef, credData, prefix)

  // use nightmare
})

test('Editor: updateNodeCredentials', () => {

  let node = {
    id: 'x'
  }
  let credDef = {}
  let prefix = 'a'
  editor.updateNodeCredentials(node, credDef, prefix)

  // use nightmare
})

test('Editor: prepareEditDialog', () => {

  let node = {
    id: 'x'
  }
  let definition = {}
  let prefix = 'a'
  editor.prepareEditDialog(node, definition, prefix, () => {
    // use nightmare
    // t.is()
  })
})

test('Editor: getEditStackTitle', () => {

  let expected = 'my-title'
  let title = editor.getEditStackTitle()
  expect(title).toBe(expected)
})

test('Editor: buildEditForm', () => {

  let container = $('#container')
  let definition = {}
  let formId = 'a'
  let ns = {}
  editor.buildEditForm(container, formId, type, ns)
  // use nightmare
})

test('Editor: refreshLabelForm', () => {

  let container = $('#container')
  let node = {
    id: 'x'
  }
  editor.refreshLabelForm(container, node)
  // use nightmare
})

test('Editor: buildLabelRow', () => {

  let type = 'io'
  let index = 0
  let value = 'hello'
  let placeholder = 'my-io'
  editor.buildLabelRow(type, index, value, placeHolder)
  // use nightmare
})

test('Editor: buildLabelForm', () => {

  let container = $('#container')
  let node = {
    id: 'x'
  }
  editor.buildLabelForm(container, node)
  // use nightmare
})

test('Editor: showEditDialog', () => {

  let node = {
    id: 'x'
  }
  editor.showEditDialog(node)
  // use nightmare
})

test('Editor: showEditConfigNodeDialog', () => {

  let node = {
    id: 'x'
  }
  let type = 'io'
  let id = 'x'
  let prefix = 'my-'
  editor.showEditConfigNodeDialog(name, type, id, prefix)
  // use nightmare
})

test('Editor: defaultConfigNodeSort', () => {

  let A = {
    id: 'a'
  }
  let B = {
    id: 'b'
  }
  editor.defaultConfigNodeSort(A, B)
})

test('Editor: updateConfigNodeSelect', () => {

  let name = 'x'
  let type = 'io'
  let value = '2'
  let prefix = 'my-'
  editor.updateConfigNodeSelect(name, type, value, prefix)
})

test('Editor: showEditSubflowDialog', () => {

  let subflow = {}
  editor.showEditSubflowDialog(subflow)
})

test('Editor: editExpression', () => {

  let options = {}
  editor.editExpression(options)
})

test('Editor: editJSON', () => {

  let options = {}
  editor.editJSON(options)
})

test('Editor: stringToUTF8Array', () => {

  let str = 'abc'
  editor.stringToUTF8Array(str)
})

test('Editor: editBuffer', () => {

  let options = {}
  editor.editBuffer(options)
})

test('Editor: createEditor', () => {

  let options = {}
  editor.createEditor(options)
})
