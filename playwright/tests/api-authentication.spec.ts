import { expect, test } from "@playwright/test";

test("should only accept authenticated requests", async ({ request }) => {
  const response = await request.post("/api/projects", {
    data: {
      name: "Test Project",
      slug: "test-project",
    },
  });

  expect(response.status()).toBe(401);
});
