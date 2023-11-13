import { Either, left, right } from '@/core/errors/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Notification } from '../../enterprise/entity/notification'
import { NotificationRepository } from '../repositories/notification-repository'

interface ReadNotificationRequest {
  receiverId: string
  notificationId: string
}

type ReadNotificationResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotification {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    receiverId,
    notificationId,
  }: ReadNotificationRequest): Promise<ReadNotificationResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (notification.receiverId.value !== receiverId) {
      return left(new NotAllowedError())
    }

    notification.markRead()

    await this.notificationRepository.save(notification)
    return right({ notification })
  }
}
