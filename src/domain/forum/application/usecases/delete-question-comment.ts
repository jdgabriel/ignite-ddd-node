import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentRequest {
  authorId: string
  questionCommentId: string
}

export class DeleteQuestionComment {
  constructor(private questionRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentRequest): Promise<void> {
    const questionComment =
      await this.questionRepository.findById(questionCommentId)
    if (!questionComment) throw new Error('Question comment not found')

    if (authorId !== questionComment.authorId.value) {
      throw new Error('Not allowed')
    }

    await this.questionRepository.delete(questionComment)
  }
}
