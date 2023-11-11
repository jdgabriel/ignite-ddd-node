import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question/question-attachment'

export function questionAttachmentFactory(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  return QuestionAttachment.create(
    {
      questionId: new UniqueEntityID('question-id'),
      attachmentId: new UniqueEntityID('attachment-id'),
      ...override,
    },
    id,
  )
}
