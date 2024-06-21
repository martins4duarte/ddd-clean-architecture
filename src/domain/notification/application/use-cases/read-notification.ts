import { Either, failure, success } from "@/core/either"
import { Notification } from "../../enterprise/entities/notification"
import { NotificationsRepository } from "../repositories/notifications-repository"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/errors/not-allowed"


interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {

  constructor(
    private notificationRepository: NotificationsRepository
  ) { }

  async execute({
    recipientId,
    notificationId
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {

    const notification = await this.notificationRepository.findById(notificationId)

    if (!notification) {
      return failure(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return failure(new NotAllowedError())
    }

    notification.read()

    await this.notificationRepository.save(notification)

    return success({
      notification
    })
  }
}