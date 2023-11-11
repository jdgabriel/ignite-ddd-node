import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Answer,
  AnswerProps,
} from '@/domain/forum/enterprise/entities/answer/answer'

export function answerFactory(
  override: Partial<AnswerProps> = {},
  id?: UniqueEntityID,
) {
  return Answer.create(
    {
      questionId: new UniqueEntityID('question-id'),
      authorId: new UniqueEntityID('author-id'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}
