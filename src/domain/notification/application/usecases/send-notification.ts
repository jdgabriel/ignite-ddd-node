import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/errors/either'
import { Notification } from '../../enterprise/entity/notification'
import { NotificationRepository } from '../repositories/notification-repository'

interface SendNotificationRequest {
  receiverId: string
  title: string
  content: string
}

type SendNotificationResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotification {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    receiverId,
    content,
    title,
  }: SendNotificationRequest): Promise<SendNotificationResponse> {
    const notification = Notification.create({
      receiverId: new UniqueEntityID(receiverId),
      content,
      title,
    })

    await this.notificationRepository.create(notification)
    return right({ notification })
  }
}
