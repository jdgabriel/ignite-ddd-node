import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question/question'

export function questionFactory(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  return Question.create(
    {
      authorId: new UniqueEntityID('1'),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}
