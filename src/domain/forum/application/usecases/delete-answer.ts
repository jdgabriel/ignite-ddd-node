import { Either, left, right } from '@/core/errors/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AnswersRepository } from '../repositories/answers-repository'

interface DeleteAnswerRequest {
  authorId: string
  answerId: string
}

type DeleteAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteAnswer {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)
    if (!answer) {
      return left(new ResourceNotFoundError())
    }
    if (authorId !== answer.authorId.value) {
      return left(new NotAllowedError())
    }

    await this.answerRepository.delete(answer)

    return right(null)
  }
}
