import { Either, left, right } from '@/core/errors/either'
import { Question } from '../../enterprise/entities/question/question'
import { QuestionRepository } from '../repositories/question-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetQuestionBySlugRequest {
  slug: string
}

type GetQuestionBySlugResponse = Either<
  ResourceNotFoundError,
  {
    question: Question
  }
>

export class GetQuestionBySlug {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugRequest): Promise<GetQuestionBySlugResponse> {
    const question = await this.questionRepository.findBySlug(slug)
    if (!question) {
      return left(new ResourceNotFoundError())
    }
    return right({ question })
  }
}
