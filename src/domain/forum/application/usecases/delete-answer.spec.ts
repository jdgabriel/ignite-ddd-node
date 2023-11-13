import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { answerAttachmentFactory } from '@test/factories/answer-attachment-factory'
import { answerFactory } from '@test/factories/answer-factory'
import { InMemoryAnswerAttachmentsRepository } from '@test/in-memory-answer-attachment-repository'
import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { DeleteAnswer } from './delete-answer'

let answerRepository: InMemoryAnswersRepository
let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswer

describe('Delete Answer', () => {
  beforeEach(() => {
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(answerAttachmentRepository)
    sut = new DeleteAnswer(answerRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = answerFactory(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )
    await answerRepository.create(newAnswer)

    answerAttachmentRepository.items.push(
      answerAttachmentFactory({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      answerAttachmentFactory({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
    })

    expect(result.isRight()).toBe(true)
    expect(answerRepository.items).toHaveLength(0)
    expect(answerAttachmentRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a answer from another user', async () => {
    const newAnswer = answerFactory(
      {
        authorId: new UniqueEntityID('author-2'),
      },
      new UniqueEntityID('answer-1'),
    )
    await answerRepository.create(newAnswer)
    expect(answerRepository.items).toHaveLength(1)

    const result = await sut.execute({
      answerId: 'answer-1',
      authorId: 'author-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
