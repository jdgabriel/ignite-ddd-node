import { Either, left, right } from '@/core/errors/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { QuestionRepository } from '../repositories/question-repository'

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
