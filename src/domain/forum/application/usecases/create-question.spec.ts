import { InMemoryQuestionRepository } from 'teste/in-memory-question-repository'
import { CreateQuestion } from './create-question'

let questionRepository: InMemoryQuestionRepository
let sut: CreateQuestion

describe('Create Question', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sut = new CreateQuestion(questionRepository)
  })

  it('should be able create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'Question title',
      content: 'New question',
    })
    expect(question.id).toBeTruthy()
    expect(question.slug.value).toEqual('question-title')
  })
})
