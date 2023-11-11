import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer/answer-comment'

export function answerCommentFactory(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  return AnswerComment.create(
    {
      answerId: new UniqueEntityID('answer-id'),
      authorId: new UniqueEntityID('author-id'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}
