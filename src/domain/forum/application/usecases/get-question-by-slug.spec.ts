import { questionFactory } from '@test/factories/question-factory'
import { InMemoryQuestionAttachmentsRepository } from '@test/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetQuestionBySlug } from './get-question-by-slug'

let questionRepository: InMemoryQuestionRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlug

describe('Get Question By Slug', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )
    sut = new GetQuestionBySlug(questionRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = questionFactory({ slug: Slug.create('question-title') })
    await questionRepository.create(newQuestion)

    const result = await sut.execute({
      slug: 'question-title',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeTruthy()
  })

  it('should not be able to get a question sending a invalid slug', async () => {
    const newQuestion = questionFactory({
      slug: Slug.create('question-title-valid'),
    })
    await questionRepository.create(newQuestion)

    const result = await sut.execute({
      slug: 'question-title-invalid',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
