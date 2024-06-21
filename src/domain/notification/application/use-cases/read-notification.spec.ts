import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('it should be able to read a notification', async () => {

    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    const item = inMemoryNotificationsRepository.items[0]

    if(result.isSuccess()) {
      expect(result.isSuccess()).toBeTruthy()
      expect(item.readAt).not.toBeNull()
      expect(item).toEqual(result.value.notification)
    }
  })

  it('it should not be able to edit a notification from another user', async () => {

    const notification = makeNotification(
      {
        recipientId: new UniqueEntityID('recipient-2')
      },
      new UniqueEntityID('notification-1')
    )

    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'recipient-1',
      notificationId: notification.id.toString(),
    })

    expect(result.isFailure()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

