import { questionFactory } from '@test/factories/question-factory'
import {
  SendNotification,
  SendNotificationRequest,
  SendNotificationResponse,
} from '../usecases/send-notification'
import { OnAnswerCreated } from './on-answer-created'

import { answerFactory } from '@test/factories/answer-factory'
import { InMemoryAnswerAttachmentsRepository } from '@test/in-memory-answer-attachment-repository'
import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { InMemoryNotificationRepository } from '@test/in-memory-notification-repository'
import { InMemoryQuestionAttachmentsRepository } from '@test/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { waitFor } from '@test/utils/wait-for'
import { SpyInstance } from 'vitest'

let sendNotification: SendNotification
let questionRepository: InMemoryQuestionRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let answerRepository: InMemoryAnswersRepository
let answerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let notificationRepository: InMemoryNotificationRepository

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationRequest],
  Promise<SendNotificationResponse>
>

describe('On Answer Created', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentsRepository,
    )
    answerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
    answerRepository = new InMemoryAnswersRepository(answerAttachmentRepository)
    notificationRepository = new InMemoryNotificationRepository()
    sendNotification = new SendNotification(notificationRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnAnswerCreated(questionRepository, sendNotification)
  })

  it('should send a notification when an answer is created', async () => {
    const question = questionFactory()
    const answer = answerFactory({ questionId: question.id })

    await questionRepository.create(question)
    await answerRepository.save(answer)

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled())
  })
})
