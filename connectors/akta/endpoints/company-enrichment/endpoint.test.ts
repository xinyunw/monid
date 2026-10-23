import { assertRejects } from "@std/assert";
import type { Json } from "@shared/core";
import {
    assertInputAccepted,
    runEndpoint,
    testSealedUnit,
} from "@shared/testing";

const ID = "akta#v1/company/enrichment";

Deno.test("akta#v1/company/enrichment schema gate: sections is required and non-empty (v1 parity)", async () => {
    const unit = await testSealedUnit(ID);
    for (
        const [why, queryParams] of [
            ["no sections", { company: "canva.com" }],
            ["empty sections", { company: "canva.com", sections: [] }],
        ] as [string, Record<string, Json>][]
    ) {
        await assertRejects(
            () => runEndpoint({ unit, input: { queryParams }, mode: "replay" }),
            Error,
            "INVALID_INPUT",
            why,
        );
    }
    for (
        const queryParams of [
            { company: "canva.com", sections: ["firmographic"] },
        ] as Record<string, Json>[]
    ) {
        await assertInputAccepted({
            unit,
            input: { queryParams },
            mode: "replay",
        });
    }
});
