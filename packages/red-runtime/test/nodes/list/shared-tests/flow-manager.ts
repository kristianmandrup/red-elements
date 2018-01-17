// To avoid test duplication
// write one test function that captures pattern we are trying to test
// then in $testMap provide different vars to test for each scenario
function testSubflowContains(context, name?) {
  const {
    $testMap,
    fakeNode,
    $nodes,
    flowManager
  } = context

  const $map = $testMap[context.$label || name]

  // TEST GOES HERE

  // Use $map
  let sfid = $map.sfid
  let nodeid = $map.nodeid
  let subflowConfig = fakeNode({
    z: sfid,
    id: sfid,
    type: $map.subflowType
  })
  let subflow = fakeNode({
    id: sfid,
    type: $map.type
  })

  $nodes.addNode(subflowConfig)
  $nodes.addSubflow(subflow)

  return flowManager.subflowContains(sfid, nodeid)
}

export const flowManager = {
  'subflowContains :- no match': (context: any = {}) => {
    return () => {
      const found = testSubflowContains(context)
      expect(found).toBeFalsy()
    }
  },

  'subflowContains :- matches': (context: any = {}) => {
    return () => {
      const found = testSubflowContains(context)
      // make expectations on return value(s)
      expect(found).toBeTruthy()

      // optionally make other function calls for further expectations to test complex scenarios
      // const found2 = testResult(context)
      // make expectations on return value(s)
    }
  }
}
