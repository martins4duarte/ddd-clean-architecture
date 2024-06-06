import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";


export interface AnswerCommentsRepository {
  findById(id: string): Promise<AnswerComment | null>;
  create(commentAnswer: AnswerComment): Promise<void>;
  delete(commentAnswer: AnswerComment): Promise<void>;
  findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]>;
}