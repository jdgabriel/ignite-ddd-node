import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { questionCommentFactory } from '@test/factories/question-comment-factory'
import { InMemoryQuestionCommentRepository } from '@test/in-memory-question-comment-repository'
import { DeleteQuestionComment } from './delete-question-comment'

let questionCommentRepository: InMemoryQuestionCommentRepository
let sut: DeleteQuestionComment

describe('Delete Question Comment', () => {
  beforeEach(() => {
    questionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new DeleteQuestionComment(questionCommentRepository)
  })

  it('should be able to delete a question-comment', async () => {
    const newQuestion = questionCommentFactory({
      authorId: new UniqueEntityID('author-1'),
    })
    await questionCommentRepository.create(newQuestion)
    expect(questionCommentRepository.items).toHaveLength(1)

    await sut.execute({
      questionCommentId: newQuestion.id.value,
      authorId: 'author-1',
    })

    expect(questionCommentRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a question-comment from another user', async () => {
    const newQuestion = questionCommentFactory({
      authorId: new UniqueEntityID('author-2'),
    })
    await questionCommentRepository.create(newQuestion)
    const result = await sut.execute({
      questionCommentId: newQuestion.id.value,
      authorId: 'author-',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
