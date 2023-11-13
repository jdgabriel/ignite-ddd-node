import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { notificationFactory } from '@test/factories/notification-factory'
import { InMemoryNotificationRepository } from '@test/in-memory-notification-repository'
import { ReadNotification } from './read-notification'

let notificationRepository: InMemoryNotificationRepository
let sut: ReadNotification

describe('Create Notification', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository()
    sut = new ReadNotification(notificationRepository)
  })

  it('should be able read a notification', async () => {
    const notification = notificationFactory()

    await notificationRepository.create(notification)

    const result = await sut.execute({
      receiverId: notification.receiverId.value,
      notificationId: notification.id.value,
    })

    expect(result.isRight()).toBe(true)
    expect(notificationRepository.items[0].readAt).toEqual(expect.any(Date))
  })

  it('should be not able to read a notification from another user', async () => {
    const notification = notificationFactory({
      receiverId: new UniqueEntityID('receiver-1'),
    })

    await notificationRepository.create(notification)

    const result = await sut.execute({
      receiverId: 'receiver-2',
      notificationId: notification.id.value,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
