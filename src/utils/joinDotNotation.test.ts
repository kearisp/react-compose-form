import {describe, it, expect} from "vitest";
import {joinDotNotation} from "./joinDotNotation";


describe("joinDotNotation", () => {
    it("joins simple names with dots", () => {
        expect(joinDotNotation("user", "name")).toBe("user.name");
        expect(joinDotNotation("profile", "contacts", "email")).toBe("profile.contacts.email");
    });

    it("splits dotted segments and flattens", () => {
        expect(joinDotNotation("user.info", "first")).toBe("user.info.first");
        expect(joinDotNotation("a.b", "c.d", "e")).toBe("a.b.c.d.e");
    });

    it("respects escaped dots (\\.) and does not split them", () => {
        expect(joinDotNotation("user\\.info")).toBe("user\\.info");
        expect(joinDotNotation("user\\.info", "first")).toBe("user\\.info.first");
        expect(joinDotNotation("one\\.two\\.three", "x")).toBe("one\\.two\\.three.x");
    });

    it("ignores empty strings and falsy names", () => {
        expect(joinDotNotation("", "a", "", "b")).toBe("a.b");
        expect(joinDotNotation("")).toBe("");
    });

    it("handles no arguments", () => {
        expect(joinDotNotation()).toBe("");
    });
});
