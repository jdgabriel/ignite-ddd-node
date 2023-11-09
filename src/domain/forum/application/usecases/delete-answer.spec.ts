import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { answerFactory } from '@test/factories/answer-factory'
import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { DeleteAnswer } from './delete-answer'

let answerRepository: InMemoryAnswersRepository
let sut: DeleteAnswer

describe('Delete Answer', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswer(answerRepository)
  })

  it('should be able to delete a answer', async () => {
    const newAnswer = answerFactory(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )
    await answerRepository.create(newAnswer)
    expect(answerRepository.items).toHaveLength(1)

    await sut.execute({ answerId: 'answer-1', authorId: 'author-1' })

    expect(answerRepository.items).toHaveLength(0)
  })

  it('should be not able to delete a answer from another user', async () => {
    const newAnswer = answerFactory(
      {
        authorId: new UniqueEntityID('author-2'),
      },
      new UniqueEntityID('answer-1'),
    )
    await answerRepository.create(newAnswer)
    expect(answerRepository.items).toHaveLength(1)

    expect(() =>
      sut.execute({ answerId: 'answer-1', authorId: 'author-1' }),
    ).rejects.toBeInstanceOf(Error)
  })
})
