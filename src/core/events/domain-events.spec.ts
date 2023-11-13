import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))
    return aggregate
  }
}

describe('Domain events', () => {
  it('should be able to dispatch and listen events', () => {
    // Spy
    const callbackSpy = vi.fn()

    // Register subscriber
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Create static aggregate
    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    // After save on database, Dispatch all events
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Event handler subscriber
    expect(callbackSpy).toHaveBeenCalled()

    // Clear all events for aggregate
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
