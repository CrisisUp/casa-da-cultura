import { formatCPF, formatPhone, classNames } from "@/lib/utils";

describe("Utils Library", () => {
  describe("formatCPF", () => {
    it("should format CPF correctly", () => {
      expect(formatCPF("12345678901")).toBe("123.456.789-01");
      expect(formatCPF("123.456.789-01")).toBe("123.456.789-01");
    });

    it("should handle partial or empty CPF", () => {
      expect(formatCPF("123")).toBe("123");
      expect(formatCPF("")).toBe("");
    });
  });

  describe("formatPhone", () => {
    it("should format phone correctly", () => {
      expect(formatPhone("11988887777")).toBe("(11) 98888-7777");
    });
  });

  describe("classNames", () => {
    it("should combine class names conditionally", () => {
      expect(classNames("foo", "bar")).toBe("foo bar");
      expect(classNames("foo", false && "bar", "baz")).toBe("foo baz");
      expect(classNames("foo", { bar: true, qux: false })).toBe("foo bar");
    });
  });
});
