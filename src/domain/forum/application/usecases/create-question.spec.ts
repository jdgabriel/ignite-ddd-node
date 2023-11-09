import { Question } from '../../enterprise/entities/question'
import { QuestionRepository } from '../repositories/question-repository'
import { CreateQuestion } from './create-question'

const fakeQuestionRepository: QuestionRepository = {
  create: async (answer: Question) => {},
}

describe('Answer Question', () => {
  it('should be answer a question', async () => {
    const sut = new CreateQuestion(fakeQuestionRepository)
    const { question } = await sut.execute({
      authorId: '1',
      title: 'Question title',
      content: 'New question',
    })
    expect(question.id).toBeTruthy()
    expect(question.slug.value).toEqual('question-title')
  })
})
