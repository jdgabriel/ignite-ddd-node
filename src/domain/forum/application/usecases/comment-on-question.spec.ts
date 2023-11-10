import { questionFactory } from '@test/factories/question-factory'
import { InMemoryQuestionCommentRepository } from '@test/in-memory-question-comment-repository'
import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { CommentOnQuestion } from './comment-on-question'

let questionRepository: InMemoryQuestionRepository
let questionCommentRepository: InMemoryQuestionCommentRepository
let sut: CommentOnQuestion

describe('Create Question', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    questionCommentRepository = new InMemoryQuestionCommentRepository()
    sut = new CommentOnQuestion(questionRepository, questionCommentRepository)
  })

  it('should be able create a question comment', async () => {
    const question = questionFactory()
    await questionRepository.create(question)

    const { questionComment } = await sut.execute({
      questionId: question.id.value,
      authorId: 'author-id-1',
      content: 'New comment on question',
    })
    expect(questionComment.id).toBeTruthy()
    expect(questionCommentRepository.items[0].content).toEqual(
      'New comment on question',
    )
  })

  it('should not be able create comment if a question not exists', async () => {
    const question = questionFactory()
    await questionRepository.create(question)

    expect(() =>
      sut.execute({
        questionId: 'question-id-invalid',
        authorId: 'author-id-1',
        content: 'New comment on question',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
