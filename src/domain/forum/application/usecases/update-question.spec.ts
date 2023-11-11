import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { questionAttachmentFactory } from '@test/factories/question-attachment-factory'
import { questionFactory } from '@test/factories/question-factory'
import { InMemoryQuestionAttachmentsRepository } from '@test/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { UpdateQuestion } from './update-question'

let questionRepository: InMemoryQuestionRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: UpdateQuestion

describe('Update Question', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    sut = new UpdateQuestion(questionRepository, questionAttachmentsRepository)
  })

  it('should be able to update a question', async () => {
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

    await sut.execute({
      questionId: newQuestion.id.value,
      authorId: 'author-1',
      title: 'New title question',
      content: 'New content',
      attachmentsId: ['1', '3'],
    })

    expect(questionRepository.items[0]).toMatchObject({
      title: 'New title question',
      content: 'New content',
    })
    expect(questionRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(questionRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should be not able to update a question from another user', async () => {
    const newQuestion = questionFactory(
      {
        authorId: new UniqueEntityID('author-2'),
      },
      new UniqueEntityID('question-1'),
    )
    await questionRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.value,
      authorId: 'author-1',
      title: 'New title question',
      content: 'New content',
      attachmentsId: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
