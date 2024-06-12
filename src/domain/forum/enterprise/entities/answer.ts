import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import { AnswerAttachment } from "./answer-attachment"

export interface AnswerProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  content: string
  attachments: AnswerAttachment[]
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {

  private touch() {
    this.props.updatedAt = new Date()
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get excerpt() {
    return this.props.content
      .substring(0, 120)
      .trimEnd()
      .concat('...')
  }

  static create(props: Optional<AnswerProps, 'createdAt' | 'attachments'>, id? : UniqueEntityID): Answer {
    const answer = new Answer({
      ...props,
      attachments: props.attachments ?? [],
      createdAt: props.createdAt ?? new Date()
    }, id)

    return answer
  }

}