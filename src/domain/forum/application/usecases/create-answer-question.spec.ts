import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from '@test/in-memory-answer-attachment-repository'
import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { CreateAnswerQuestion } from './create-answer-question'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let sut: CreateAnswerQuestion

describe('Answer Question', () => {
  beforeEach(() => {
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentRepository,
    )
    sut = new CreateAnswerQuestion(answersRepository)
  })

  it('should be able to create a answer', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'New Answer',
      attachmentsIds: ['1', '2'],
    })
    expect(result.isRight()).toBe(true)
    expect(answersRepository.items[0]).toEqual(result.value?.answer)
    expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(answersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
