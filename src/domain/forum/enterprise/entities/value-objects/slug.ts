export class Slug {
  public text: string

  private constructor(text: string) {
    this.text = text;
  }

  static create(slug: string) {
    return new Slug(slug);
  }

  static createFromText(text: string) {
    const slug = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slug)
  }
}