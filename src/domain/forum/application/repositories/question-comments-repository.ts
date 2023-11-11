import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question/question-comment'

export interface QuestionCommentsRepository {
  findById(id: string): Promise<QuestionComment | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Array<QuestionComment>>
  delete(questionComment: QuestionComment): Promise<void>
  create(questionComment: QuestionComment): Promise<void>
}
