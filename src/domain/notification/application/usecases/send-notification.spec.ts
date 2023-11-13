import { InMemoryNotificationRepository } from '@test/in-memory-notification-repository'
import { SendNotification } from './send-notification'

let notificationRepository: InMemoryNotificationRepository
let sut: SendNotification

describe('Create Notification', () => {
  beforeEach(() => {
    notificationRepository = new InMemoryNotificationRepository()
    sut = new SendNotification(notificationRepository)
  })

  it('should be able create a notification', async () => {
    const result = await sut.execute({
      receiverId: '1',
      title: 'Title notification',
      content: 'Notification content',
    })

    expect(result.isRight()).toBe(true)
    expect(notificationRepository.items[0]).toEqual(result.value?.notification)
  })
})
