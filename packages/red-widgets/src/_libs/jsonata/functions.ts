export const functions = {
  '$append': {
    args: ['array', 'array']
  },
  '$average': {
    args: ['value']
  },
  '$boolean': {
    args: ['value']
  },
  '$contains': {
    args: ['str', 'pattern']
  },
  '$count': {
    args: ['array']
  },
  '$exists': {
    args: ['value']
  },
  '$join': {
    args: ['array', 'separator']
  },
  '$keys': {
    args: ['object']
  },
  '$length': {
    args: ['string']
  },
  '$lookup': {
    args: ['object', 'key']
  },
  '$lowercase': {
    args: ['string']
  },
  '$match': {
    args: ['str', 'pattern', 'limit']
  },
  '$map': {
    args: []
  },
  '$max': {
    args: ['array']
  },
  '$min': {
    args: ['array']
  },
  '$not': {
    args: ['value']
  },
  '$number': {
    args: ['value']
  },
  '$reduce': {
    args: []
  },
  '$replace': {
    args: ['str', 'pattern', 'replacement', 'limit']
  },
  '$split': {
    args: ['string', 'separator', 'limit']
  },
  '$spread': {
    args: ['object']
  },
  '$string': {
    args: ['value']
  },
  '$substring': {
    args: ['string', 'start', 'length']
  },
  '$substringAfter': {
    args: ['string', 'chars']
  },
  '$substringBefore': {
    args: ['string', 'chars']
  },
  '$sum': {
    args: ['array']
  },
  '$trim': {
    args: ['str']
  },
  '$uppercase': {
    args: ['string']
  }
}
