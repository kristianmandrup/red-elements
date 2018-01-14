import {
  $,
  widgets,
  readPage
} from '../_infra'

const {
  NodeEditor,
} = widgets

function create() {
  return new NodeEditor()
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

function merge(a, b) {
  return Object.assign(a, b)
}

function fakeNode(override = {}) {
  return Object.assign({
    id: 'x',
    in: {},
    out: {},
    type: 'subflow',
    _def: {
      credentials: {},
      defaults: {},
      set: {
        module: 'node-red'
      }
    }
  }, override)
}

test('Editor: create', () => {
  expect(editor.editStack).toEqual([])
})

test('Editor: getCredentialsURL', () => {
  let url = editor.getCredentialsURL('a b', 'x')
  expect(url).toBe('credentials/a-b/x')
})

test('Editor: validateNode', () => {
  // TODO: use real (or better mock) node
  let node = merge(fakeNode(), {
    type: 'subflow:',
    valid: true,
    changed: true
  })
  let valid = editor.validateNode(node)
  expect(valid).toBeTruthy()
})

test('Editor: validateNodeProperties', () => {
  let node = fakeNode()
  let definition = node._def
  let properties = {}
  let valid = editor.validateNodeProperties(node, definition, properties)
  expect(valid).toBeTruthy()
})

test('Editor: validateNodeProperty', () => {
  let node = fakeNode()
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
  let node = fakeNode()
  let defaults = {}
  let property = 'name';
  let prefix = 'a'
  let valid = editor.validateNodeEditorProperty(node, defaults, property, prefix)
  expect(valid).toBeDefined()
})

test('Editor: validateNodeEditor', () => {
  let node = fakeNode()
  let prefix = 'a'
  let valid = editor.validateNodeEditor(node, prefix)
  expect(valid).toBeDefined()
})

test('Editor: updateNodeProperties', () => {
  let node = fakeNode()
  let output = {}
  let removedLinks = editor.updateNodeProperties(node, {})
  expect(removedLinks).toBeTruthy()
})

test('Editor: prepareConfigNodeSelect', () => {
  let node = fakeNode()
  let type = 'io'
  let property = 'name'
  let prefix = 'a'
  let prepared = editor.prepareConfigNodeSelect(node, property, type, prefix)
  expect(prepared).toBeDefined()
})

test('Editor: prepareConfigNodeButton', () => {
  let node = fakeNode()
  let type = 'io'
  let property = 'name'
  let prefix = 'a'
  let prepared = editor.prepareConfigNodeButton(node, property, type, prefix)
  expect(prepared).toBeDefined()
})

test('Editor: preparePropertyEditor', () => {
  let node = fakeNode()
  let definition = {}
  let property = 'name'
  let prefix = 'a'
  let prepared = editor.preparePropertyEditor(node, property, prefix, definition)
  expect(prepared).toBeTruthy()
})

test('Editor: attachPropertyChangeHandler', () => {
  let node = fakeNode()
  let definition = {}
  let property = 'name'
  let prefix = 'a'
  let prepared = editor.attachPropertyChangeHandler(node, definition, property, prefix)
  expect(prepared).toBeTruthy()
})

test('Editor: populateCredentialsInputs', () => {
  let node = fakeNode()
  let credDef = {}
  let credData = {}
  let prefix = 'a'
  editor.populateCredentialsInputs(node, credDef, credData, prefix)

  // use nightmare
})

test('Editor: updateNodeCredentials', () => {
  let node = fakeNode()
  let credDef = {}
  let prefix = 'a'
  editor.updateNodeCredentials(node, credDef, prefix)

  // use nightmare
})

test('Editor: prepareEditDialog', () => {
  let node = fakeNode()
  let definition = node._def
  let prefix = 'a'
  let done = editor.prepareEditDialog(node, definition, prefix, (result) => {
    expect(result).toBeDefined()
  })
})

test('Editor: getEditStackTitle', () => {
  let expected = '<ul class=\"editor-tray-breadcrumbs\"></ul>'
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

test('Editor: refreshLabelForm', () => {
  let container = $('#container')
  let node = fakeNode()
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
  let node = fakeNode()
  editor.buildLabelForm(container, node)
  // use nightmare
})

test('Editor: showEditDialog - subflow', () => {
  let node = fakeNode()
  let shown = editor.showEditDialog(node)
  expect(shown).toBeDefined()
})

test('Editor: showEditConfigNodeDialog', () => {
  let node = fakeNode()
  let type = 'io'
  let id = 'x'
  let prefix = 'my-'
  editor.showEditConfigNodeDialog(name, type, id, prefix)
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
  let subflow = fakeNode()
  let shown = editor.showEditSubflowDialog(subflow)
  expect(shown).toBeDefined()
})

test('Editor: editExpression', () => {
  let options = {
    value: {

    },
    complete() { }
  }

  editor.editExpression(options)
})

test('Editor: editJSON', () => {
  let options = {
    value: {

    },
    complete() { }
  }
  editor.editJSON(options)
})

test('Editor: stringToUTF8Array - string', () => {
  let str = 'abc'
  let buffer = editor.stringToUTF8Array(str)
  expect(buffer).toBeDefined()
})

test('Editor: stringToUTF8Array - undefined', () => {
  expect(() => editor.stringToUTF8Array()).toThrowError()
})

test('Editor: editBuffer', () => {
  let options = {
    value: {

    },
    complete() { }
  }

  // FIX: jsonata.functions not defined
  let result = editor.editBuffer(options)
  expect(result).toBeDefined()
})

test('Editor: createEditor', () => {
  let options = {
    id: 'editor',
    value: 'hello',
    complete() { }
  }
  let result = editor.createEditor(options)
  expect(result).toBeDefined()
})
