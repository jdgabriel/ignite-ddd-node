import { QuestionAttachment } from '../../enterprise/entities/question/question-attachment'

export interface QuestionAttachmentRepository {
  findManyByQuestionId(questionId: string): Promise<Array<QuestionAttachment>>
  deleteManyByQuestionId(questionId: string): Promise<void>
}
