import { Notification } from '../../enterprise/entity/notification'

export interface NotificationRepository {
  create(notification: Notification): Promise<void>
  save(notification: Notification): Promise<void>
}
