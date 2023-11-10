import { QuestionComment } from '../../enterprise/entities/comment/question-comment'

export interface QuestionCommentsRepository {
  findById(id: string): Promise<QuestionComment | null>
  delete(questionComment: QuestionComment): Promise<void>
  create(questionComment: QuestionComment): Promise<void>
}
