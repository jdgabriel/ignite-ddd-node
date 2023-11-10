import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/comment/answer-comment'
import { AnswersCommentsRepository } from '../repositories/answers-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'

interface CommentOnAnswerRequest {
  answerId: string
  authorId: string
  content: string
}

interface CommentOnAnswerResponse {
  answerComment: AnswerComment
}

export class CommentOnAnswer {
  constructor(
    private answerRepository: AnswersRepository,
    private answerCommentRepository: AnswersCommentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
  }: CommentOnAnswerRequest): Promise<CommentOnAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)
    if (!answer) throw new Error('Answer no found')

    const answerComment = AnswerComment.create({
      answerId: new UniqueEntityID(answerId),
      authorId: new UniqueEntityID(authorId),
      content,
    })

    await this.answerCommentRepository.create(answerComment)
    return { answerComment }
  }
}
