import { makeAnswer } from 'test/factories/makeAnswer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answer-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeQuestion } from 'test/factories/makeQuestion'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionAttachments: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRespository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationsUseCase: SendNotificationUseCase
let inMemoryStudentesRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

// let sendNotificationExecuteSpy: MockInstance<
//   (
//     request: SendNotificationUseCaseRequest,
//   ) => Promise<SendNotificationUseCaseResponse>
// >

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryQuestionAttachments = new InMemoryQuestionAttachmentsRepository()
    inMemoryStudentesRepository = new InMemoryStudentsRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachments,
      inMemoryAttachmentsRepository,
      inMemoryStudentesRepository,
    )

    inMemoryAnswerAttachmentsRespository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRespository,
    )

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationsUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationsUseCase, 'execute')

    new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotificationsUseCase) //eslint-disable-line
  })

  it('should send a notification when question has new best answer chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id

    await inMemoryQuestionsRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
