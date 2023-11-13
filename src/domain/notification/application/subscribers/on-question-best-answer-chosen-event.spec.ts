import { questionFactory } from '@test/factories/question-factory'
import {
  SendNotification,
  SendNotificationRequest,
  SendNotificationResponse,
} from '../usecases/send-notification'

import { answerFactory } from '@test/factories/answer-factory'
import { InMemoryAnswerAttachmentsRepository } from '@test/in-memory-answer-attachment-repository'
import { InMemoryAnswersRepository } from '@test/in-memory-answers-repository'
import { InMemoryNotificationRepository } from '@test/in-memory-notification-repository'
import { InMemoryQuestionAttachmentsRepository } from '@test/in-memory-question-attachment-repository'
import { InMemoryQuestionRepository } from '@test/in-memory-question-repository'
import { waitFor } from '@test/utils/wait-for'
import { SpyInstance } from 'vitest'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen-event'

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

describe('On Question best answer chosen', () => {
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

    new OnQuestionBestAnswerChosen(answerRepository, sendNotification)
  })

  it('should send a notification when question has new best answer chosen', async () => {
    const question = questionFactory()
    const answer = answerFactory({ questionId: question.id })

    await questionRepository.create(question)
    await answerRepository.create(answer)

    question.bestAnswerId = answer.id
    await questionRepository.save(question)

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled())
  })
})
