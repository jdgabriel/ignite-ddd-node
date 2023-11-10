import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { questionCommentFactory } from '@test/factories/question-comment-factory'
import { InMemoryQuestionCommentRepository } from '@test/in-memory-question-comment-repository'
import { FetchQuestionComments } from './fetch-question-comments'

let questionCommentsRepository: InMemoryQuestionCommentRepository
let sut: FetchQuestionComments

describe('Fetch Question Comment', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentRepository()
    sut = new FetchQuestionComments(questionCommentsRepository)
  })

  it('should be able to fetch a question comments', async () => {
    const questionId = new UniqueEntityID('question-valid-id')
    await questionCommentsRepository.create(
      questionCommentFactory({ questionId }),
    )
    await questionCommentsRepository.create(
      questionCommentFactory({ questionId }),
    )
    await questionCommentsRepository.create(
      questionCommentFactory({ questionId }),
    )

    const { questionComments } = await sut.execute({
      questionId: questionId.value,
      page: 1,
    })
    expect(questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    const questionId = new UniqueEntityID('question-valid-id')
    for (let index = 1; index <= 22; index++) {
      await questionCommentsRepository.create(
        questionCommentFactory({ questionId }),
      )
    }

    const { questionComments } = await sut.execute({
      questionId: questionId.value,
      page: 2,
    })
    expect(questionComments).toHaveLength(2)
  })
})
