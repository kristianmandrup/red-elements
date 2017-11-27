import {
    readPage,
    ctx,
    RED,
    controllers
} from '../../imports'

import utils from '../../../controllers/utils/utils'

beforeAll(() => {
    // Menu has no widget factory, just a class
  
    // load document with placeholder elements to create widgets (for testing)
  })

test('utils: create', () => {
    var util = utils.createObjectElement({}, { key: true, path: '', rootPath: '' });
    expect(typeof util).toBe('object');
})
test('Utils: with string', () => {
    var util = utils.createObjectElement('test', { key: false, path: '', rootPath: '', sourceId: 1 });
    expect(typeof util).toBe('object');
})
test('Util: with number object', () => {
    var util = utils.createObjectElement(56, { key: false, path: '', rootPath: '', sourceId: 1 });
    expect(typeof util).toBe('object');
})
test('Util: with array object', () => {
    var util = utils.createObjectElement([56, 2, 3, 5], { key: false, path: '', rootPath: '', sourceId: 1 });
    expect(typeof util).toBe('object');
})
test('Util: with exposeApi', () => {
    var util = utils.createObjectElement([56, 2, 3, 5], { key: false, path: '', rootPath: '', sourceId: 1, exposeApi: true });
    expect(typeof util).toBe('object');
})

test('Util: with getMessage', () => {
    utils.getMessageProperty('Test string','//');
    expect(typeof utils.getMessageProperty).toBe('function');
})

test('Util: with normalisePropertyExpression', () => {
    utils.normalisePropertyExpression('Teststring');
    expect(typeof utils.normalisePropertyExpression).toBe('function');
})

test('Util: with getNodeIcon', () => {
    var path=utils.getNodeIcon({category :'config',icon:function(){}},{type :'tab'});
    expect(path).toBe('icons/node-red/cog.png');
})

test('Util: getNodeIcon with node type tab', () => {
    var path=utils.getNodeIcon({category :'',icon:function(){}},{type :'tab'});
    expect(path).toBe('icons/node-red/subflow.png');
})

test('Util: getNodeIcon with node type unknown', () => {
    var path=utils.getNodeIcon({category :'',icon:function(){}},{type :'unknown'});
    expect(path).toBe('icons/node-red/alert.png');
})

test('Util: getNodeIcon with node type subflow', () => {
    var path=utils.getNodeIcon({category :'',icon:function(){}},{type :'subflow'});
    expect(path).toBe('icons/node-red/subflow.png');
})

test('Util: getNodeIcon default', () => {
    var path=utils.getNodeIcon({category :'',icon:function(){},set:{module:'test'}},{type :''});
    expect(path).toBe('icons/test/undefined');
})

// test('Util: getNodeLabel ', () => {
//     var path=utils.getNodeLabel({type :'tab'},'test');
//     expect(path).toBe('icons/test/undefined');
// })
test('Util: makeExpandable ', () => {
    function onbuild(){};
    function ontoggle(){};
    function expand(){};

    utils.makeExpandable($("#collapse"),onbuild,ontoggle,expand);
    //expect(path).toBe('icons/test/undefined');
})