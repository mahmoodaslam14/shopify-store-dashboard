import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("skips falsy values", () => {
    expect(cn("a", false, "b", undefined, null, "", "c")).toBe("a b c");
  });
});
