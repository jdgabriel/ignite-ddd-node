import { Either, right } from '@/core/errors/either'
import { AnswerComment } from '../../enterprise/entities/comment/answer-comment'
import { AnswersCommentsRepository } from '../repositories/answers-comments-repository'

interface FetchAnswerCommentsRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsResponse = Either<
  null,
  { answerComments: Array<AnswerComment> }
>

export class FetchAnswerComments {
  constructor(private answerCommentRepository: AnswersCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsRequest): Promise<FetchAnswerCommentsResponse> {
    const answerComments =
      await this.answerCommentRepository.findManyByAnswerId(answerId, {
        page,
      })

    return right({ answerComments })
  }
}
