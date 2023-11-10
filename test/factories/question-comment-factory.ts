import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/comment/question-comment'

export function questionCommentFactory(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  return QuestionComment.create(
    {
      questionId: new UniqueEntityID('question-id'),
      authorId: new UniqueEntityID('author-id'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )
}
