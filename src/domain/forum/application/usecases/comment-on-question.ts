import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/comment/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionRepository } from '../repositories/question-repository'

interface CommentOnQuestionRequest {
  questionId: string
  authorId: string
  content: string
}

interface CommentOnQuestionResponse {
  questionComment: QuestionComment
}

export class CommentOnQuestion {
  constructor(
    private questionRepository: QuestionRepository,
    private questionCommentRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    content,
  }: CommentOnQuestionRequest): Promise<CommentOnQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)
    if (!question) throw new Error('Question no found')

    const questionComment = QuestionComment.create({
      questionId: new UniqueEntityID(questionId),
      authorId: new UniqueEntityID(authorId),
      content,
    })

    await this.questionCommentRepository.create(questionComment)
    return { questionComment }
  }
}
