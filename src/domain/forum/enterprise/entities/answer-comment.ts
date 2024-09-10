import type { UniqueEntityID } from "@/core/entities/unique-entity-id"
import type { Optional } from "@/core/types/optional"
import { Comment, type CommentProps } from "./comment"
import { AnswerCommentedEvent } from "../events/answer-commented-event"

export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

export class AnswerComment extends Comment<AnswerCommentProps> {

  get answerId() {
    return this.props.answerId
  }

  static create(props: Optional<AnswerCommentProps, 'createdAt'>, id?: UniqueEntityID): AnswerComment {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date()
      },
      id
    )

    const isNewAnswerComment = !id
    
    if (isNewAnswerComment) {
      answerComment.addDomainEvent(new AnswerCommentedEvent(answerComment))
    }

    return answerComment
  }

}