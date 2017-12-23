import {
  RED,
  readPage,
  Editor
} from './imports'

function create() {
  return new Editor()
}

const { log } = console

let editor
beforeEach(() => {
  editor = create()
})

beforeAll(() => {
  // widgets that need to be available
  // EditableList(RED)

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('editor', __dirname);
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
    id: 'x',
    type: 'subflow:',
    valid: true,
    changed: true
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
  let definition = {
    name: {
      "required": true
    }
  }
  let properties = {}
  let value = 'a'
  let property = 'name';
  let valid = editor.validateNodeProperty(node, definition, property, value)
  expect(valid).toBeTruthy()
})

test('Editor: validateNodeEditorProperty', () => {
  let node = {
    id: 'x'
  }
  let defaults = {}
  let property = 'name';
  let prefix = 'a'
  let valid = editor.validateNodeEditorProperty(node, defaults, property, prefix)
  expect(valid).toBeDefined()
})

test('Editor: validateNodeEditor', () => {
  let node = {
    id: 'x',
    _def: {
      defaults: [],
      credentials: []
    }
  }
  let prefix = 'a'
  let valid = editor.validateNodeEditor(node, prefix)
  expect(valid).toBeDefined()
})

test('Editor: updateNodeProperties', () => {
  let node = {
    id: 'x'
  }
  let output = {}
  let removedLinks = editor.updateNodeProperties(node, {})
  expect(removedLinks).toBeTruthy()
})

test('Editor: prepareConfigNodeSelect', () => {
  let node = {
    id: 'x'
  }
  let type = 'io'
  let property = 'name'
  let prefix = 'a'
  let prepared = editor.prepareConfigNodeSelect(node, property, type, prefix)
  expect(prepared).toBeDefined()
})

test('Editor: prepareConfigNodeButton', () => {

  let node = {
    id: 'x'
  }
  let type = 'io'
  let property = 'name'
  let prefix = 'a'
  let prepared = editor.prepareConfigNodeButton(node, property, type, prefix)
  expect(prepared).toBeDefined()
})

test('Editor: preparePropertyEditor', () => {

  let node = {
    id: 'x'
  }
  let definition = {}
  let property = 'name'
  let prefix = 'a'
  let prepared = editor.preparePropertyEditor(node, property, prefix, definition)
  expect(prepared).toBeTruthy()
})

test('Editor: attachPropertyChangeHandler', () => {

  let node = {
    id: 'x'
  }
  let definition = {}
  let property = 'name'
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
  let definition = {
    defaults: {
      // some default props
    }
  }
  let prefix = 'a'
  let done = editor.prepareEditDialog(node, definition, prefix)
  expect(done).toBeDefined()
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
  let type = "text";
  editor.buildEditForm(container, formId, type, ns)
  // use nightmare
})

test.only('Editor: refreshLabelForm', () => {

  let container = $('#container')
  let node = {
    id: 'x',
    _def: {

    }
  }
  let refreshed = editor.refreshLabelForm(container, node)
  expect(refreshed).toBeDefined()
})

test('Editor: buildLabelRow', () => {

  let type = 'io'
  let index = 0
  let value = 'hello'
  let placeholder = 'my-io'
  editor.buildLabelRow(type, index, value, placeholder)
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
