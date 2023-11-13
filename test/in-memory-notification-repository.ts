import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entity/notification'

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Array<Notification> = []

  constructor() {}

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    )
    this.items[itemIndex] = notification
  }
}
