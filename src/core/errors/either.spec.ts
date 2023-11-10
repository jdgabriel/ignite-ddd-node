import { Either, left, right } from './either'

function doSomething(x: boolean): Either<string, string> {
  return x ? right('success') : left('error')
}

describe('Either Teste', () => {
  it('success result', () => {
    const success = doSomething(true)
    expect(success.isRight()).toBe(true)
    expect(success.isLeft()).toBe(false)
  })

  it('error result', () => {
    const error = doSomething(false)
    expect(error.isRight()).toBe(false)
    expect(error.isLeft()).toBe(true)
  })
})
