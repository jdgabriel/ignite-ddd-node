import { UniqueEntityID } from '@/core/entities/unique-entity-id'
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

  it('should be able to delete a question-comment', async () => {
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

  it('should be not able to delete a question-comment from another user', async () => {
    const newAnswerComment = answerCommentFactory({
      authorId: new UniqueEntityID('author-2'),
    })
    await answerCommentRepository.create(newAnswerComment)

    expect(() =>
      sut.execute({
        answerCommentId: newAnswerComment.id.value,
        authorId: 'author-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
