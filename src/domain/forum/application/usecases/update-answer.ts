import { Either, left, right } from '@/core/errors/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface UpdateAnswerRequest {
  answerId: string
  authorId: string
  content: string
}

type UpdateAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class UpdateAnswer {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
    content,
  }: UpdateAnswerRequest): Promise<UpdateAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)
    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.value) {
      return left(new NotAllowedError())
    }

    answer.content = content

    await this.answerRepository.save(answer)
    return right({ answer })
  }
}
