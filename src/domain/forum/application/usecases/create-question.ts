import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/errors/either'
import { Question } from '../../enterprise/entities/question/question'
import { QuestionAttachment } from '../../enterprise/entities/question/question-attachment'
import { QuestionRepository } from '../repositories/question-repository'

interface CreateQuestionRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: Array<string>
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
    attachmentsIds,
  }: CreateQuestionRequest): Promise<CreateQuestionResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      content,
      title,
    })

    const questionAttachments = attachmentsIds.map((id) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityID(id),
        questionId: question.id,
      }),
    )

    question.attachments = questionAttachments

    await this.questionRepository.create(question)
    return right({ question })
  }
}
