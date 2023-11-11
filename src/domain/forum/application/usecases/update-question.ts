import { Either, left, right } from '@/core/errors/either'
import { Question } from '../../enterprise/entities/question/question'
import { QuestionRepository } from '../repositories/question-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface UpdateQuestionRequest {
  questionId: string
  authorId: string
  title: string
  content: string
}

type UpdateQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class UpdateQuestion {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
  }: UpdateQuestionRequest): Promise<UpdateQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)
    if (!question) {
      return left(new ResourceNotFoundError())
    }
    if (authorId !== question.authorId.value) {
      return left(new NotAllowedError())
    }

    question.title = title
    question.content = content

    await this.questionRepository.save(question)
    return right({ question })
  }
}
