import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/question-repository'
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event'
import { SendNotification } from './../usecases/send-notification'

export class OnAnswerCommentCreatedEvent implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private questionRepository: QuestionRepository,
    private sendNotification: SendNotification,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({
    answerComment,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answerRepository.findById(
      answerComment.answerId.value,
    )
    if (!answer) return

    const question = await this.questionRepository.findById(
      answer.questionId.value,
    )
    if (!question) return

    await this.sendNotification.execute({
      receiverId: answer.authorId.value,
      content: answerComment.excerpt,
      title: `New comment at ${question.title.substring(0, 20).concat('...')}`,
    })
  }
}
