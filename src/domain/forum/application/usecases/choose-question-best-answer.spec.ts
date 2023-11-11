import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { answerFactory } from '@test/factories/answer-factory'
import { questionFactory } from '@test/factories/question-factory'
import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { ChooseBestAnswerQuestion } from './choose-question-best-answer'
import { NotAllowedError } from './errors/not-allowed-error'

let questionRepository: InMemoryQuestionRepository
let answerRepository: InMemoryAnswersRepository
let sut: ChooseBestAnswerQuestion

describe('Delete Answer', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository()
    questionRepository = new InMemoryQuestionRepository()
    sut = new ChooseBestAnswerQuestion(questionRepository, answerRepository)
  })

  it('should be able to choose the question best answer', async () => {
    const question = questionFactory()
    const answer = answerFactory({
      questionId: question.id,
    })

    await questionRepository.create(question)
    await answerRepository.create(answer)

    await sut.execute({
      answerId: answer.id.value,
      authorId: question.authorId.value,
    })

    expect(questionRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose another user question best answer', async () => {
    const question = questionFactory({
      authorId: new UniqueEntityID('author-id'),
    })
    const answer = answerFactory({
      questionId: question.id,
    })

    await questionRepository.create(question)
    await answerRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.value,
      authorId: 'another-author-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
