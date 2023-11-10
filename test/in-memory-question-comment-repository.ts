import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/comment/question-comment'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentsRepository
{
  public items: Array<QuestionComment> = []

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.value === id)
    if (!questionComment) return null
    return questionComment
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )
    this.items.splice(itemIndex, 1)
  }
}
