import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { questionCommentFactory } from '@test/factories/question-comment-factory'
import { InMemoryQuestionCommentRepository } from '@test/in-memory-question-comment-repository'
import { DeleteQuestion } from './delete-question-comment'

let questionCommentRepository: InMemoryQuestionCommentRepository
let sut: DeleteQuestion

describe('Delete Question Comment', () => {
  beforeEach(() => {
    questionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new DeleteQuestion(questionCommentRepository)
  })

  it('should be able to delete a question-comment', async () => {
    const newQuestion = questionCommentFactory(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-comment-1'),
    )
    await questionCommentRepository.create(newQuestion)
    expect(questionCommentRepository.items).toHaveLength(1)

    await sut.execute({
      questionCommentId: 'question-comment-1',
      authorId: 'author-1',
    })

    expect(questionCommentRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a question-comment from another user', async () => {
    const newQuestion = questionCommentFactory(
      {
        authorId: new UniqueEntityID('author-2'),
      },
      new UniqueEntityID('question-comment-1'),
    )
    await questionCommentRepository.create(newQuestion)

    expect(() =>
      sut.execute({
        questionCommentId: 'question-comment-1',
        authorId: 'author-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
