import {
  History
} from '../..'
import { factories } from '../playbox/shared-tests';
import { transform } from 'typescript';

 //import { log } from 'util';
 const {log} = console

function create() {
  return new History()
}

let history
beforeEach(() => {
  history = create()
})

//const { log } = console

test('history: create', () => {
  expect(history).toBeDefined()
})

test('history: peek', () => {
  let ev = {
    id: 'a'
  }

  history.push(ev)
  history.push(ev)
  let latest = history.peek()
  expect(latest).toBe(ev)
})

test('history: push', () => {
  let ev = {
    id: 'a'
  }
  history.push(ev)
  let latest = history.peek()
  expect(latest).toBe(ev)
})

test('history: pop', () => {
  let evA = {
    id: 'a'
  }
  let evB = {
    id: 'b'
  }
  history.push(evA)
  history.pop()

  //let latest = history.peek()
  //expect(history.peek()).toBeEmpty();
  
  history.push(evA)
  history.push(evB)
  history.pop()
  let latest = history.peek()
  expect(latest).toBe(evA)
})

test('history: list', () => {
  let evA = {
    id: 'a'
  }
  let evB = {
    id: 'b'
  }
  history.push(evA)
  history.push(evB)
  let list = history.list

  expect(list[1]).toBe(evA)
  expect(list[2]).toBe(evB)
})

test('history: depth', () => {
  let evA = {
    id: 'a'
  }
  let evB = {
    id: 'b'
  }  
  history.push(evA)
  history.push(evB)
  
  let depth = history.depth
  expect(depth).toBe(2)
})

test('history: markAllDirty', () => {
  let evA = {
    id: 'a'
  }  

  let evB = {
    id: 'b'
  }  

  history.push(evA)
  history.push(evB) 

  history.markAllDirty()

  let list = history.list
  let item = list[1]
  item.dirty = true

  expect(item.dirty).toBeTruthy()
})

test('history: undo', () => {
  let ev = {
    id: 'a'
  }
  log(ev)

  history.push(ev)
  let latest = history.peek()
  
  expect(latest).toBe(ev)
  history.undo()

//  log(history.undo())

  latest = history.peek()
  expect(latest).toBeFalsy()
})