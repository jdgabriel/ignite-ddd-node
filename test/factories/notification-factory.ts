import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entity/notification'

export function notificationFactory(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  return Notification.create(
    {
      receiverId: new UniqueEntityID('receiver-1'),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id,
  )
}
