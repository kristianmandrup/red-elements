export const factories = {
  '1 + 2 == 3': (context: any = {}) => {
    return () => {
      console.log('+', {
        number: context.number
      })
      expect(1 + context.number).toBe(3)
    }
  },
  '3 - 2 == 1': (context: any = {}) => {
    return () => {
      console.log('-', {
        number: context.number
      })
      expect(3 - context.number).toBe(1)
    }
  }
}
