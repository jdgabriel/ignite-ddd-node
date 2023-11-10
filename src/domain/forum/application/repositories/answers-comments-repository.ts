import { AnswerComment } from '../../enterprise/entities/comment/answer-comment'

export interface AnswersCommentsRepository {
  create(QuestionComment: AnswerComment): Promise<void>
}
