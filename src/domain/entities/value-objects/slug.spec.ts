import { expect, test } from "vitest";
import { Slug } from "./slug";

test('it should be able to create a new slug from text title', () => {
  const slug = Slug.createFromText('This is a test title');
  expect(slug.text).toBe('this-is-a-test-title');
})