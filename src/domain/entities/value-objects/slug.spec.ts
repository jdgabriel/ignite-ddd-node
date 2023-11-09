import { Slug } from "./slug";

describe("Slug", () => {
  it("should be create a slug", () => {
    const slug = Slug.createFromText("New Question From Student");
    expect(slug.value).toEqual("new-question-from-student");
  });
});
