import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer/answer-comment'

export class InMemoryAnswerCommentRepository
  implements AnswersCommentsRepository
{
  public items: Array<AnswerComment> = []

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.value === id)
    if (!answerComment) return null
    return answerComment
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.value === answerId)
      .slice((page - 1) * 20, page * 20)
    return answerComments
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
    DomainEvents.dispatchEventsForAggregate(answerComment.id)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )
    this.items.splice(itemIndex, 1)
  }
}
