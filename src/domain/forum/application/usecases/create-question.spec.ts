import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { CreateQuestion } from './create-question'

let questionRepository: InMemoryQuestionRepository
let sut: CreateQuestion

describe('Create Question', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sut = new CreateQuestion(questionRepository)
  })

  it('should be able create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Question title',
      content: 'New question',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value?.question.slug.value).toMatchObject('question-title')
  })
})
