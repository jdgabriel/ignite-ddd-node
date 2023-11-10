import { QuestionComment } from '../../enterprise/entities/comment/question-comment'

export interface QuestionCommentsRepository {
  create(QuestionComment: QuestionComment): Promise<void>
}
