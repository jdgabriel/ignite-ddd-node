import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionRequest {
  authorId: string
  questionCommentId: string
}

export class DeleteQuestion {
  constructor(private questionRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionRequest): Promise<void> {
    const questionComment =
      await this.questionRepository.findById(questionCommentId)
    if (!questionComment) throw new Error('Question comment not found')

    if (authorId !== questionComment.authorId.value) {
      throw new Error('Not allowed')
    }

    await this.questionRepository.delete(questionComment)
  }
}
