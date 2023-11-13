import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/errors/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Answer } from '../../enterprise/entities/answer/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer/answer-attachment-list'
import { AnswerAttachmentRepository } from '../repositories/answer-attachment-repository'
import { AnswersRepository } from '../repositories/answers-repository'

interface UpdateAnswerRequest {
  answerId: string
  authorId: string
  content: string
  attachmentsIds: Array<string>
}

type UpdateAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class UpdateAnswer {
  constructor(
    private answerRepository: AnswersRepository,
    private answerAttachmentRepository: AnswerAttachmentRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentsIds,
  }: UpdateAnswerRequest): Promise<UpdateAnswerResponse> {
    const answer = await this.answerRepository.findById(answerId)
    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.value) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentRepository.findManyByAnswerId(answer.id.value)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const answerAttachments = attachmentsIds.map((id) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityID(id),
        answerId: answer.id,
      }),
    )

    answerAttachmentList.update(answerAttachments)

    answer.content = content
    answer.attachments = answerAttachmentList

    await this.answerRepository.save(answer)
    return right({ answer })
  }
}
