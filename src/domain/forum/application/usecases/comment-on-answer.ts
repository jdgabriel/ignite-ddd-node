import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/errors/either'
import { AnswerComment } from '../../enterprise/entities/answer/answer-comment'
import { AnswersCommentsRepository } from '../repositories/answers-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CommentOnAnswerRequest {
  answerId: string
  authorId: string
  content: string
}

type CommentOnAnswerResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>

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
    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      answerId: new UniqueEntityID(answerId),
      authorId: new UniqueEntityID(authorId),
      content,
    })

    await this.answerCommentRepository.create(answerComment)
    return right({ answerComment })
  }
}
