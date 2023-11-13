import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/errors/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Question } from '../../enterprise/entities/question/question'
import { QuestionAttachment } from '../../enterprise/entities/question/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question/question-attachment-list'
import { QuestionAttachmentRepository } from '../repositories/question-attachment-repository'
import { QuestionRepository } from '../repositories/question-repository'

interface UpdateQuestionRequest {
  questionId: string
  authorId: string
  title: string
  content: string
  attachmentsId: Array<string>
}

type UpdateQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class UpdateQuestion {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentRepository: QuestionAttachmentRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    title,
    content,
    attachmentsId,
  }: UpdateQuestionRequest): Promise<UpdateQuestionResponse> {
    const question = await this.questionRepository.findById(questionId)
    if (!question) {
      return left(new ResourceNotFoundError())
    }
    if (authorId !== question.authorId.value) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentsId.map((id) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityID(id),
        questionId: question.id,
      }),
    )

    questionAttachmentList.update(questionAttachments)

    question.title = title
    question.content = content
    question.attachments = questionAttachmentList

    await this.questionRepository.save(question)
    return right({ question })
  }
}
