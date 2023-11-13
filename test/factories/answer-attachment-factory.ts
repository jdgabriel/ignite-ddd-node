import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer/answer-attachment'

export function answerAttachmentFactory(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  return AnswerAttachment.create(
    {
      answerId: new UniqueEntityID('answer-id'),
      attachmentId: new UniqueEntityID('attachment-id'),
      ...override,
    },
    id,
  )
}
