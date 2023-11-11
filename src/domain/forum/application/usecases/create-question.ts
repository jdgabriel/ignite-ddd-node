import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/errors/either'
import { Question } from '../../enterprise/entities/question/question'
import { QuestionRepository } from '../repositories/question-repository'

interface CreateQuestionRequest {
  authorId: string
  title: string
  content: string
}

type CreateQuestionResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestion {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionRequest): Promise<CreateQuestionResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      content,
      title,
    })
    await this.questionRepository.create(question)
    return right({ question })
  }
}
