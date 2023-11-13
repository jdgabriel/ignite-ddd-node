import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotification } from './../usecases/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionRepository: QuestionRepository,
    private sendNotification: SendNotification,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionRepository.findById(
      answer.questionId.value,
    )

    if (!question) return

    await this.sendNotification.execute({
      receiverId: question.authorId.value,
      content: answer.content,
      title: `New notification at ${question.title
        .substring(0, 40)
        .concat('...')}`,
    })
  }
}
