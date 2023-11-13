import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { answerFactory } from '@test/factories/answer-factory'
import { questionFactory } from '@test/factories/question-factory'
import { InMemoryAnswerAttachmentsRepository } from '@test/in-memory-answer-attachment-repository'
import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { InMemoryQuestionAttachmentsRepository } from '@test/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { ChooseBestAnswerQuestion } from './choose-question-best-answer'

let questionRepository: InMemoryQuestionRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let answerRepository: InMemoryAnswersRepository
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: ChooseBestAnswerQuestion

describe('Delete Answer', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )
    answerRepository = new InMemoryAnswersRepository(
      answerAttachmentsRepository,
    )
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
