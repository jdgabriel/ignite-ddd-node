import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { answerFactory } from '@test/factories/answer-factory'
import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { UpdateAnswer } from './update-answer'

let answerRepository: InMemoryAnswersRepository
let sut: UpdateAnswer

describe('Update Answer', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository()
    sut = new UpdateAnswer(answerRepository)
  })

  it('should be able to update a answer', async () => {
    const newAnswer = answerFactory(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    )
    await answerRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.value,
      authorId: 'author-1',
      content: 'New content',
    })

    expect(answerRepository.items[0]).toMatchObject({
      content: 'New content',
    })
  })

  it('should be not able to update a answer from another user', async () => {
    const newAnswer = answerFactory(
      {
        authorId: new UniqueEntityID('author-2'),
      },
      new UniqueEntityID('answer-1'),
    )
    await answerRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.value,
      authorId: 'author-1',
      content: 'New content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
