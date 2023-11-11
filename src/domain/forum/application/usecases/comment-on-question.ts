import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/errors/either'
import { QuestionComment } from '../../enterprise/entities/question/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CommentOnQuestionRequest {
  questionId: string
  authorId: string
  content: string
}

type CommentOnQuestionResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

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
    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      questionId: new UniqueEntityID(questionId),
      authorId: new UniqueEntityID(authorId),
      content,
    })

    await this.questionCommentRepository.create(questionComment)
    return right({ questionComment })
  }
}
