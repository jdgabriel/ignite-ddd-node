import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer/answer'

export interface AnswersRepository {
  findById(id: string): Promise<Answer | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Array<Answer>>
  create(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
}
