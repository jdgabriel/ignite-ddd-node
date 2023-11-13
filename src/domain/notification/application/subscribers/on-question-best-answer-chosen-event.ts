import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestQuestionChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'
import { SendNotification } from './../usecases/send-notification'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotification: SendNotification,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestQuestionChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestQuestionChosenEvent) {
    const answer = await this.answerRepository.findById(bestAnswerId.value)

    if (!answer) return

    await this.sendNotification.execute({
      receiverId: question.authorId.value,
      content: `Your answer has chosen at ${question.title
        .substring(0, 20)
        .concat('...')}`,
      title: `Best answer`,
    })
  }
}
