import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentRepository
{
  public items: Array<AnswerAttachment> = []

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.value === answerId,
    )
    return answerAttachments
  }

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.value !== answerId,
    )
    this.items = answerAttachments
  }
}
