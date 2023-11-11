import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { questionAttachmentFactory } from '@test/factories/question-attachment-factory'
import { questionFactory } from '@test/factories/question-factory'
import { InMemoryQuestionAttachmentsRepository } from '@test/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { DeleteQuestion } from './delete-question'
import { NotAllowedError } from './errors/not-allowed-error'

let questionRepository: InMemoryQuestionRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestion

describe('Delete Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )
    sut = new DeleteQuestion(questionRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = questionFactory(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )
    await questionRepository.create(newQuestion)
    questionAttachmentsRepository.items.push(
      questionAttachmentFactory({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      questionAttachmentFactory({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    expect(questionRepository.items).toHaveLength(1)

    await sut.execute({ questionId: 'question-1', authorId: 'author-1' })

    expect(questionRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a question from another user', async () => {
    const newQuestion = questionFactory(
      {
        authorId: new UniqueEntityID('author-2'),
      },
      new UniqueEntityID('question-1'),
    )
    await questionRepository.create(newQuestion)
    expect(questionRepository.items).toHaveLength(1)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
