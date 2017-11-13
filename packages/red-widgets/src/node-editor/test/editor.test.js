import {
  Editor
} from './imports'

const ctx = {}

function create(ctx) {
  return new Editor(ctx)
}

test('Editor: create', () => {
  let editor = create(ctx)
  t.deepEqual(editor.editStack, [])
})

test('Editor: getCredentialsURL', () => {
  let editor = create(ctx)
  let url = editor.getCredentialsURL('a b', 'x')
  t.is(url, 'credentials/a-b/x')
})

test('Editor: validateNode', () => {
  let editor = create(ctx)
  let node = {
    id: 'x'
  }
  let valid = editor.validateNode(node)
  t.truthy(valid)
})

test('Editor: validateNodeProperties', () => {
  let editor = create(ctx)
  let node = {
    id: 'x'
  }
  let definition = {}
  let properties = {}
  let valid = editor.validateNodeProperties(node, definition, properties)
  t.truthy(valid)
})

test('Editor: validateNodeProperty', () => {
  let editor = create(ctx)
  let node = {
    id: 'x'
  }
  let definition = {}
  let properties = {}
  let value = 'a'
  let valid = editor.validateNodeProperty(node, definition, property, value)
  t.truthy(valid)
})

test('Editor: validateNodeEditor', () => {
  let editor = create(ctx)
  let node = {
    id: 'x'
  }
  let prefix = 'a'
  let valid = editor.validateNodeEditor(node, prefix)
  t.truthy(valid)
})

test('Editor: validateNodeEditorProperty', () => {
  let editor = create(ctx)
  let node = {
    id: 'x'
  }
  let defaults = {}
  let property = {}
  let prefix = 'a'
  let valid = editor.validateNodeEditorProperty(node, defaults, property, prefix)
  t.truthy(valid)
})

test('Editor: updateNodeProperties', () => {
  let editor = create(ctx)
  let node = {
    id: 'x'
  }
  let output = {}
  let removedLinks = editor.updateNodeProperties(node, outputMap)
  t.truthy(removedLinks)
})

test('Editor: prepareConfigNodeSelect', () => {
  let editor = create(ctx)
  let node = {
    id: 'x'
  }
  let type = 'io'
  let property = {}
  let prefix = 'a'
  let prepared = editor.prepareConfigNodeSelect(node, property, type, prefix)
  t.truthy(prepared)
})

test('Editor: prepareConfigNodeButton', () => {
  let editor = create(ctx)
  let node = {
    id: 'x'
  }
  let type = 'io'
  let property = {}
  let prefix = 'a'
  let prepared = editor.prepareConfigNodeButton(node, property, type, prefix)
  t.truthy(prepared)
})

test('Editor: preparePropertyEditor', () => {
  let editor = create(ctx)
  let node = {
    id: 'x'
  }
  let definition = {}
  let property = {}
  let prefix = 'a'
  let prepared = editor.preparePropertyEditor(node, property, prefix, definition)
  t.truthy(prepared)
})

test('Editor: attachPropertyChangeHandler', () => {
  let editor = create(ctx)
  let node = {
    id: 'x'
  }
  let definition = {}
  let property = {}
  let prefix = 'a'
  let prepared = editor.attachPropertyChangeHandler(node, definition, property, prefix)
  t.truthy(prepared)
})

test('Editor: populateCredentialsInputs', () => {
  let editor = create(ctx)
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
  let editor = create(ctx)
  let node = {
    id: 'x'
  }
  let credDef = {}
  let prefix = 'a'
  editor.updateNodeCredentials(node, credDef, prefix)

  // use nightmare
})

test('Editor: prepareEditDialog', () => {
  let editor = create(ctx)
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
  let editor = create(ctx)
  let expected = 'my-title'
  let title = editor.getEditStackTitle()
  expect(title).toBe(expected)
})

test('Editor: buildEditForm', () => {
  let editor = create(ctx)
  let container = $('#container')
  let definition = {}
  let formId = 'a'
  let ns = {}
  editor.buildEditForm(container, formId, type, ns)
  // use nightmare
})

test('Editor: refreshLabelForm', () => {
  let editor = create(ctx)
  let container = $('#container')
  let node = {
    id: 'x'
  }
  editor.refreshLabelForm(container, node)
  // use nightmare
})

test('Editor: buildLabelRow', () => {
  let editor = create(ctx)
  let type = 'io'
  let index = 0
  let value = 'hello'
  let placeholder = 'my-io'
  editor.buildLabelRow(type, index, value, placeHolder)
  // use nightmare
})

test('Editor: buildLabelForm', () => {
  let editor = create(ctx)
  let container = $('#container')
  let node = {
    id: 'x'
  }
  editor.buildLabelForm(container, node)
  // use nightmare
})

test('Editor: showEditDialog', () => {
  let editor = create(ctx)
  let node = {
    id: 'x'
  }
  editor.showEditDialog(node)
  // use nightmare
})

test('Editor: showEditConfigNodeDialog', () => {
  let editor = create(ctx)
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
  let editor = create(ctx)
  let A = {
    id: 'a'
  }
  let B = {
    id: 'b'
  }
  editor.defaultConfigNodeSort(A, B)
})

test('Editor: updateConfigNodeSelect', () => {
  let editor = create(ctx)
  let name = 'x'
  let type = 'io'
  let value = '2'
  let prefix = 'my-'
  editor.updateConfigNodeSelect(name, type, value, prefix)
})

test('Editor: showEditSubflowDialog', () => {
  let editor = create(ctx)
  let subflow = {}
  editor.showEditSubflowDialog(subflow)
})

test('Editor: editExpression', () => {
  let editor = create(ctx)
  let options = {}
  editor.editExpression(options)
})

test('Editor: editJSON', () => {
  let editor = create(ctx)
  let options = {}
  editor.editJSON(options)
})

test('Editor: stringToUTF8Array', () => {
  let editor = create(ctx)
  let str = 'abc'
  editor.stringToUTF8Array(str)
})

test('Editor: editBuffer', () => {
  let editor = create(ctx)
  let options = {}
  editor.editBuffer(options)
})

test('Editor: createEditor', () => {
  let editor = create(ctx)
  let options = {}
  editor.createEditor(options)
})
