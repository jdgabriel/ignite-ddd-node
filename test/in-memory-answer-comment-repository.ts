import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/comment/answer-comment'

export class InMemoryAnswerCommentRepository
  implements AnswersCommentsRepository
{
  public items: Array<AnswerComment> = []

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.value === id)
    if (!answerComment) return null
    return answerComment
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    )
    this.items.splice(itemIndex, 1)
  }
}
