import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/errors/either'
import { Answer } from '../../enterprise/entities/answer/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionRequest {
  questionId: string
  instructorId: string
  content: string
}

type AnswerQuestionResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestion {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })
    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
