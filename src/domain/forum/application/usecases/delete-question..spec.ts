import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { questionFactory } from 'teste/factories/question-factory'
import { InMemoryQuestionRepository } from 'teste/in-memory-question-repository'
import { DeleteQuestion } from './delete-question'

let questionRepository: InMemoryQuestionRepository
let sut: DeleteQuestion

describe('Delete Question', () => {
  beforeEach(() => {
    questionRepository = new InMemoryQuestionRepository()
    sut = new DeleteQuestion(questionRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = questionFactory(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )
    await questionRepository.create(newQuestion)
    expect(questionRepository.items).toHaveLength(1)

    await sut.execute({ questionId: 'question-1', authorId: 'author-1' })

    expect(questionRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a question from another user', async () => {
    const newQuestion = questionFactory(
      {
        authorId: new UniqueEntityID('author-2'),
      },
      new UniqueEntityID('question-1'),
    )
    await questionRepository.create(newQuestion)
    expect(questionRepository.items).toHaveLength(1)

    expect(() =>
      sut.execute({ questionId: 'question-1', authorId: 'author-1' }),
    ).rejects.toBeInstanceOf(Error)
  })
})
