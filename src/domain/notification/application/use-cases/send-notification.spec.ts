import {InMemoryNotificationsRepository} from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('it should be able to send a notification', async () => {

    const result = await sut.execute({
      content: 'content of notitication notification',
      recipientId: '1',
      title: 'new notification',
    })

    const item = inMemoryNotificationsRepository.items[0]
  
    expect(result.isSuccess()).toBeTruthy()
    expect(item).toEqual(result.value?.notification)

  })
})

