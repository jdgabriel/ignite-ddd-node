import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { answerFactory } from '@test/factories/answer-factory'
import { InMemoryAnswerAttachmentsRepository } from '@test/in-memory-answer-attachment-repository'
import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { UpdateAnswer } from './update-answer'

let answerRepository: InMemoryAnswersRepository
let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let sut: UpdateAnswer

describe('Update Answer', () => {
  beforeEach(() => {
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(answerAttachmentRepository)
    sut = new UpdateAnswer(answerRepository, answerAttachmentRepository)
  })

  it('should be able to update a answer', async () => {
    const newAnswer = answerFactory(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )
    await answerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.value,
      authorId: 'author-1',
      content: 'New content',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(answerRepository.items[0]).toMatchObject({
      content: 'New content',
    })
  })

  it('should be not able to update a answer from another user', async () => {
    const newAnswer = answerFactory(
      {
        authorId: new UniqueEntityID('author-2'),
      },
      new UniqueEntityID('answer-1'),
    )
    await answerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.value,
      authorId: 'author-1',
      content: 'New content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
