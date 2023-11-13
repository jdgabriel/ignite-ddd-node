import {
  SendNotification,
  SendNotificationRequest,
  SendNotificationResponse,
} from '../usecases/send-notification'

import { answerCommentFactory } from '@test/factories/answer-comment-factory'
import { answerFactory } from '@test/factories/answer-factory'
import { questionFactory } from '@test/factories/question-factory'
import { InMemoryAnswerAttachmentsRepository } from '@test/in-memory-answer-attachment-repository'
import { InMemoryAnswerCommentRepository } from '@test/in-memory-answer-comment-repository'
import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { InMemoryNotificationRepository } from '@test/in-memory-notification-repository'
import { InMemoryQuestionAttachmentsRepository } from '@test/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { waitFor } from '@test/utils/wait-for'
import { SpyInstance } from 'vitest'
import { OnAnswerCommentCreatedEvent } from './on-answer-comment-created-event'

let sendNotification: SendNotification
let questionRepository: InMemoryQuestionRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let answerRepository: InMemoryAnswersRepository
let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let answerCommentRepository: InMemoryAnswerCommentRepository
let notificationRepository: InMemoryNotificationRepository

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationRequest],
  Promise<SendNotificationResponse>
>

describe('On answer question created', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(answerAttachmentRepository)
    notificationRepository = new InMemoryNotificationRepository()
    sendNotification = new SendNotification(notificationRepository)
    answerCommentRepository = new InMemoryAnswerCommentRepository()
    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnAnswerCommentCreatedEvent(
      answerRepository,
      questionRepository,
      sendNotification,
    )
  })

  it('should send a notification when question has new best answer chosen', async () => {
    const question = questionFactory()
    const answer = answerFactory({ questionId: question.id })

    const answerComment = answerCommentFactory({
      answerId: answer.id,
    })

    await questionRepository.create(question)
    await answerRepository.create(answer)
    await answerCommentRepository.create(answerComment)

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled())
  })
})
