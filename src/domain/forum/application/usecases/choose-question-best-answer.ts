import { Either, left, right } from '@/core/errors/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Question } from '../../enterprise/entities/question/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionRepository } from '../repositories/question-repository'

interface ChooseBestAnswerQuestionRequest {
  answerId: string
  authorId: string
}

type ChooseBestAnswerQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class ChooseBestAnswerQuestion {
  constructor(
    private questionRepository: QuestionRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseBestAnswerQuestionRequest): Promise<ChooseBestAnswerQuestionResponse> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionRepository.findById(
      answer.questionId.value,
    )
    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.value) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return right({ question })
  }
}
