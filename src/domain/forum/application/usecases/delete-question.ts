import { Either, left, right } from '@/core/errors/either'
import { QuestionRepository } from '../repositories/question-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteQuestionRequest {
  authorId: string
  questionId: string
}

type DeleteQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteQuestion {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionRequest): Promise<DeleteQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)
    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.value) {
      return left(new NotAllowedError())
    }

    await this.questionRepository.delete(question)
    return right(null)
  }
}
