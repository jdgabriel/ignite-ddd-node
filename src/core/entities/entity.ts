import { UniqueEntityID } from "./unique-entity-id";

export class Entity<Props> {
  private _id: UniqueEntityID;
  protected props: Props;

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props;
    this._id = id ?? new UniqueEntityID();
  }

  get id() {
    return this._id;
  }
}
