import { Answer } from '../forum/enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { AnswerQuestion } from './answer-question'

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {},
}

describe('Answer Question', () => {
  it('should be answer a question', async () => {
    const sut = new AnswerQuestion(fakeAnswersRepository)
    const answer = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'New Answer',
    })

    expect(answer.content).toEqual('New Answer')
  })
})
