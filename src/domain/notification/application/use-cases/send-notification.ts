import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import  { type Either, success } from "@/core/either"
import { Notification } from "../../enterprise/entities/notification"
import type { NotificationsRepository } from "../repositories/notifications-repository"


export interface SendNotificationUseCaseRequest {
  recipientId: string
  content: string
  title: string
}

export type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
> 

export class SendNotificationUseCase {

  constructor(
    private notificationRepository: NotificationsRepository
  ) {}

  async execute({ 
    title, 
    content, 
    recipientId,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {

    const notification = Notification.create({
      title, 
      content, 
      recipientId: new UniqueEntityID(recipientId),
    })

    await this.notificationRepository.create(notification)

    return success({
      notification
    })
  }
}