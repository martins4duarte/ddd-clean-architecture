import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { QuestionBestQuestionChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";

export class OnQuestionBestAnswerChosenSubscriber implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register<QuestionBestQuestionChosenEvent>(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestQuestionChosenEvent.name
    )
  }

  private async sendQuestionBestAnswerNotification({ question, bestAnswerId }: QuestionBestQuestionChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString()
    )

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        content: answer.excerpt,
        title: `Your answer was chosen as best answer, congrats!: ${question.title}`,
      })
    }

  }

}