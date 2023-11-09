import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export function questionFactory(override?: Partial<QuestionProps>) {
  return Question.create({
    authorId: new UniqueEntityID('1'),
    title: 'Question title',
    slug: Slug.create('question-title'),
    content: 'Question content',
    ...override,
  })
}
