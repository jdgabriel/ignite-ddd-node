import { questionFactory } from 'teste/factories/question-factory'
import { InMemoryQuestionRepository } from 'teste/in-memory-question-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetQuestionBySlug } from './get-question-by-slug'

let questionRepository: InMemoryQuestionRepository
let sut: GetQuestionBySlug

describe('Get Question By Slug', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sut = new GetQuestionBySlug(questionRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = questionFactory({ slug: Slug.create('question-title') })
    await questionRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'question-title',
    })

    expect(question.id).toBeTruthy()
  })
})
