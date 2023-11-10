import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/comment/question-comment'

export class InMemoryQuestionCommentRepository
  implements QuestionCommentsRepository
{
  public items: Array<QuestionComment> = []

  async create(QuestionComment: QuestionComment) {
    this.items.push(QuestionComment)
  }
}
