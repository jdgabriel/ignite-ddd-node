import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { questionFactory } from '@test/factories/question-factory'
import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { UpdateQuestion } from './update-question'

let questionRepository: InMemoryQuestionRepository
let sut: UpdateQuestion

describe('Update Question', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sut = new UpdateQuestion(questionRepository)
  })

  it('should be able to update a question', async () => {
    const newQuestion = questionFactory(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )
    await questionRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.value,
      authorId: 'author-1',
      title: 'New title question',
      content: 'New content',
    })

    expect(questionRepository.items[0]).toMatchObject({
      title: 'New title question',
      content: 'New content',
    })
  })

  it('should be not able to update a question from another user', async () => {
    const newQuestion = questionFactory(
      {
        authorId: new UniqueEntityID('author-2'),
      },
      new UniqueEntityID('question-1'),
    )
    await questionRepository.create(newQuestion)

    expect(() =>
      sut.execute({
        questionId: newQuestion.id.value,
        authorId: 'author-1',
        title: 'New title question',
        content: 'New content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
