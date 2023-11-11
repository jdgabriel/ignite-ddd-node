import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { AnswerQuestion } from './answer-question'

let answersRepository: InMemoryAnswersRepository
let sut: AnswerQuestion

describe('Answer Question', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestion(answersRepository)
  })

  it('should be able to create a answer', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'New Answer',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.answer.content).toEqual('New Answer')
    expect(answersRepository.items[0].id).toEqual(result.value?.answer.id)
  })
})
