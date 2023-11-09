import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionRepository } from 'teste/in-memory-question-repository'
import { Question } from '../../enterprise/entities/question'
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
    const newQuestion = Question.create({
      authorId: new UniqueEntityID('1'),
      title: 'Question title',
      slug: Slug.create('question-title'),
      content: 'Question content',
    })
    await questionRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'question-title',
    })

    expect(question.id).toBeTruthy()
  })
})
