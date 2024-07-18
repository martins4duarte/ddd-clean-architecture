import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerCommentedEvent } from "@/domain/forum/enterprise/events/answer-commented-event";

export class OnAnswerCommentedSubscriber implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register<AnswerCommentedEvent>(
      this.sendAnswerCommentNotification.bind(this),
      AnswerCommentedEvent.name
    )
  }

  private async sendAnswerCommentNotification({ answerComment }: AnswerCommentedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString()
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        content: answerComment.content,
        title: `Your answer has a new comment!`,
      })
    }

  }

}