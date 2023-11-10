import { answerFactory } from '@test/factories/answer-factory'

import { InMemoryAnswerCommentRepository } from '@test/in-memory-answer-comment-repository'
import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { CommentOnAnswer } from './comment-on-answer'

let answerRepository: InMemoryAnswersRepository
let answerCommentRepository: InMemoryAnswerCommentRepository
let sut: CommentOnAnswer

describe('Create Answer', () => {
  beforeEach(() => {
    answerRepository = new InMemoryAnswersRepository()
    answerCommentRepository = new InMemoryAnswerCommentRepository()
    sut = new CommentOnAnswer(answerRepository, answerCommentRepository)
  })

  it('should be able create a answer comment', async () => {
    const answer = answerFactory()
    await answerRepository.create(answer)

    const { answerComment } = await sut.execute({
      answerId: answer.id.value,
      authorId: 'author-id-1',
      content: 'New comment on answer',
    })
    expect(answerComment.id).toBeTruthy()
    expect(answerCommentRepository.items[0].content).toEqual(
      'New comment on answer',
    )
  })

  it('should not be able create comment if a answer not exists', async () => {
    const answer = answerFactory()
    await answerRepository.create(answer)

    expect(() =>
      sut.execute({
        answerId: 'answer-id-invalid',
        authorId: 'author-id-1',
        content: 'New comment on answer',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
