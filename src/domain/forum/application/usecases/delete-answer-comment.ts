import { AnswersCommentsRepository } from '../repositories/answers-comments-repository'

interface DeleteAnswerCommentRequest {
  authorId: string
  answerCommentId: string
}

export class DeleteAnswerComment {
  constructor(private answerCommentRepository: AnswersCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentRequest): Promise<void> {
    const questionComment =
      await this.answerCommentRepository.findById(answerCommentId)
    if (!questionComment) throw new Error('Answer comment not found')

    if (authorId !== questionComment.authorId.value) {
      throw new Error('Not allowed')
    }

    await this.answerCommentRepository.delete(questionComment)
  }
}
