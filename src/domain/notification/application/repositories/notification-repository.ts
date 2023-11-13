import { Notification } from '../../enterprise/entity/notification'

export interface NotificationRepository {
  findById(notificationId: string): Promise<Notification | null>
  create(notification: Notification): Promise<void>
  save(notification: Notification): Promise<void>
}
