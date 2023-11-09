import { answerFactory } from '@test/factories/answer-factory'
import { questionFactory } from '@test/factories/question-factory'
import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { FetchQuestionAnswers } from './fetch-question-answers'

let answerRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswers

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository()
    sut = new FetchQuestionAnswers(answerRepository)
  })

  it('should be able to fetch question answers', async () => {
    const question = questionFactory()

    await answerRepository.create(answerFactory({ questionId: question.id }))
    await answerRepository.create(answerFactory({ questionId: question.id }))
    await answerRepository.create(answerFactory({ questionId: question.id }))

    const { answers } = await sut.execute({
      questionId: question.id.value,
      page: 1,
    })
    expect(answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    const question = questionFactory()
    for (let index = 1; index <= 22; index++) {
      await answerRepository.create(answerFactory({ questionId: question.id }))
    }

    const { answers } = await sut.execute({
      questionId: question.id.value,
      page: 2,
    })
    expect(answers).toHaveLength(2)
  })
})
