import { randomUUID } from "node:crypto";

export class UniqueEntityID {
  private readonly _value: string;

  toString() {
    return this._value.toString()
  }

  toValue() {
    return this._value
  }

  constructor(value?: string) {
    this._value = value ?? randomUUID()
  }
}