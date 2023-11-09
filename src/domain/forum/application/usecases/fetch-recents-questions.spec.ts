import { questionFactory } from '@test/factories/question-factory'
import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { FetchRecentQuestions } from './fetch-recents-questions'

let questionRepository: InMemoryQuestionRepository
let sut: FetchRecentQuestions

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
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

    const { questions } = await sut.execute({ page: 1 })
    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2023, 3, 23) }),
      expect.objectContaining({ createdAt: new Date(2023, 2, 9) }),
      expect.objectContaining({ createdAt: new Date(2023, 1, 20) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let index = 1; index <= 22; index++) {
      await questionRepository.create(questionFactory())
    }
    const { questions } = await sut.execute({ page: 2 })
    expect(questions).toHaveLength(2)
  })
})
