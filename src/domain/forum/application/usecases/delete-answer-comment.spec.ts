import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { answerCommentFactory } from '@test/factories/answer-comment-factory'
import { InMemoryAnswerCommentRepository } from '@test/in-memory-answer-comment-repository'
import { DeleteAnswerComment } from './delete-answer-comment'

let answerCommentRepository: InMemoryAnswerCommentRepository
let sut: DeleteAnswerComment

describe('Delete Question Comment', () => {
  beforeEach(() => {
    answerCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new DeleteAnswerComment(answerCommentRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const newAnswerComment = answerCommentFactory({
      authorId: new UniqueEntityID('author-1'),
    })
    await answerCommentRepository.create(newAnswerComment)
    expect(answerCommentRepository.items).toHaveLength(1)

    await sut.execute({
      answerCommentId: newAnswerComment.id.value,
      authorId: 'author-1',
    })

    expect(answerCommentRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a answer comment from another user', async () => {
    const newAnswerComment = answerCommentFactory({
      authorId: new UniqueEntityID('author-2'),
    })
    await answerCommentRepository.create(newAnswerComment)

    const result = await sut.execute({
      answerCommentId: newAnswerComment.id.value,
      authorId: 'author-1',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
