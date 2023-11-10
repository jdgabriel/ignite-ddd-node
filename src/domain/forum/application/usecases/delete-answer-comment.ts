import { Either, left, right } from '@/core/errors/either'
import { AnswersCommentsRepository } from '../repositories/answers-comments-repository'

interface DeleteAnswerCommentRequest {
  authorId: string
  answerCommentId: string
}

type DeleteAnswerCommentResponse = Either<string, null>

export class DeleteAnswerComment {
  constructor(private answerCommentRepository: AnswersCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentRequest): Promise<DeleteAnswerCommentResponse> {
    const questionComment =
      await this.answerCommentRepository.findById(answerCommentId)
    if (!questionComment) throw new Error('Answer comment not found')

    if (authorId !== questionComment.authorId.value) {
      return left('Not allowed')
    }

    await this.answerCommentRepository.delete(questionComment)

    return right(null)
  }
}
