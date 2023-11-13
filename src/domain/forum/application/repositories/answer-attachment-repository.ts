import { AnswerAttachment } from '../../enterprise/entities/answer/answer-attachment'

export interface AnswerAttachmentRepository {
  findManyByAnswerId(answerId: string): Promise<Array<AnswerAttachment>>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
