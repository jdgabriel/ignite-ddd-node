import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/comment/answer-comment'

export interface AnswersCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<Array<AnswerComment>>
  create(answerComment: AnswerComment): Promise<void>
  delete(answerComment: AnswerComment): Promise<void>
}
