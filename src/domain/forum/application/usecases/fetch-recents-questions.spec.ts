import { questionFactory } from '@test/factories/question-factory'
import { InMemoryQuestionAttachmentsRepository } from '@test/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { FetchRecentQuestions } from './fetch-recents-questions'

let questionRepository: InMemoryQuestionRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestions

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )
    sut = new FetchRecentQuestions(questionRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await questionRepository.create(
      questionFactory({ createdAt: new Date(2023, 2, 9) }),
    )
    await questionRepository.create(
      questionFactory({ createdAt: new Date(2023, 1, 20) }),
    )
    await questionRepository.create(
      questionFactory({ createdAt: new Date(2023, 3, 23) }),
    )

    const result = await sut.execute({ page: 1 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 3, 23) }),
      expect.objectContaining({ createdAt: new Date(2023, 2, 9) }),
      expect.objectContaining({ createdAt: new Date(2023, 1, 20) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let index = 1; index <= 22; index++) {
      await questionRepository.create(questionFactory())
    }
    const result = await sut.execute({ page: 2 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questions).toHaveLength(2)
  })
})
