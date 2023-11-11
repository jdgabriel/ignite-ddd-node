import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { answerCommentFactory } from '@test/factories/answer-comment-factory'
import { InMemoryAnswerCommentRepository } from '@test/in-memory-answer-comment-repository'
import { FetchAnswerComments } from './fetch-answer-comments'

let answerCommentsRepository: InMemoryAnswerCommentRepository
let sut: FetchAnswerComments

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentRepository()
    sut = new FetchAnswerComments(answerCommentsRepository)
  })

  it('should be able to fetch a answer comments', async () => {
    const answerId = new UniqueEntityID('question-valid-id')
    await answerCommentsRepository.create(answerCommentFactory({ answerId }))
    await answerCommentsRepository.create(answerCommentFactory({ answerId }))
    await answerCommentsRepository.create(answerCommentFactory({ answerId }))

    const result = await sut.execute({
      answerId: answerId.value,
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    const answerId = new UniqueEntityID('question-valid-id')
    for (let index = 1; index <= 22; index++) {
      await answerCommentsRepository.create(answerCommentFactory({ answerId }))
    }

    const result = await sut.execute({
      answerId: answerId.value,
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
  })
})
