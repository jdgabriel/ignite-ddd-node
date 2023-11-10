import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/comment/answer-comment'

export class InMemoryAnswerCommentRepository
  implements AnswersCommentsRepository
{
  public items: Array<AnswerComment> = []

  async create(AnswerComment: AnswerComment) {
    this.items.push(AnswerComment)
  }
}
