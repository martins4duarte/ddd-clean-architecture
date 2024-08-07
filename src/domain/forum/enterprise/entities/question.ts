import { AggregateRoot } from "@/core/entities/aggregate-root"
import { Slug } from "./value-objects/slug"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import moment from "moment"
import { QuestionAttachmentList } from "./question-attachment-list"
import { QuestionBestQuestionChosenEvent } from "../events/question-best-answer-chosen-event"

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  title: string
  content: string
  slug: Slug
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {

  private touch() {
    this.props.updatedAt = new Date()
  }
  
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)

    this.touch()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  get attachments() {
    return this.props.attachments
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return moment().diff(this.props.createdAt) <= 3
  }

  get excerpt() {
    return this.content
      .substring(0, 120)
      .trimEnd()
      .concat('...')
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    if(!bestAnswerId) {
      return
    } 

    if(this.props.bestAnswerId === undefined || !this.props.bestAnswerId.equals(bestAnswerId)) {
      this.addDomainEvent(new QuestionBestQuestionChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>, 
    id? : UniqueEntityID
  ): Question {

    const question = new Question({
      ...props,
      slug: props.slug ?? Slug.createFromText(props.title),
      attachments: props.attachments ?? new QuestionAttachmentList(),
      createdAt: props.createdAt ?? new Date(),
    }, id)

    return question
  }
}
