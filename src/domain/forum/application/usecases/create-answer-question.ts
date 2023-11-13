import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/errors/either'
import { Answer } from '../../enterprise/entities/answer/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer/answer-attachment-list'
import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionRequest {
  questionId: string
  instructorId: string
  content: string
  attachmentsIds: Array<string>
}

type AnswerQuestionResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class CreateAnswerQuestion {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionRequest): Promise<AnswerQuestionResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    const answerAttachments = attachmentsIds.map((id) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityID(id),
        answerId: answer.id,
      }),
    )

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
