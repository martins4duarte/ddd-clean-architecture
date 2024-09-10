import { DomainEvents } from "@/core/events/domain-events";
import type { EventHandler } from "@/core/events/event-handler";
import type { SendNotificationUseCase } from "../use-cases/send-notification";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { QuestionCommentedEvent } from "@/domain/forum/enterprise/events/question-commented-event";

export class OnQuestionCommentedSubscriber implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register<QuestionCommentedEvent>(
      this.sendQuestionCommentNotification.bind(this),
      QuestionCommentedEvent.name
    )
  }

  private async sendQuestionCommentNotification({ questionComment }: QuestionCommentedEvent) {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString()
    )
    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        content: questionComment.content,
        title: 'Your question has a new comment!',
      })
    }

  }

}