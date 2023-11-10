import { AnswerComment } from '../../enterprise/entities/comment/answer-comment'

export interface AnswersCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>
  create(answerComment: AnswerComment): Promise<void>
  delete(answerComment: AnswerComment): Promise<void>
}
