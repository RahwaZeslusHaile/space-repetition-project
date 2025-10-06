import { getUserIds } from "./users.mjs";
import assert from "node:assert";
import test from "node:test";
import { calculateRevisionDates } from "./storage.mjs";
test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});


  test("calculates correct revision dates", () => {
    const input = "2028-02-29";
    const result = calculateRevisionDates(input);

    assert.deepStrictEqual(result,{
    oneWeek: "2028-03-07",
    oneMonth: "2028-03-28",
    threeMonths: "2028-05-28",
    sixMonths: "2028-08-28",
    oneYear: "2029-03-01",}
    )}
    );
  

  test("throws error if no input", () => {
    assert.throws(()=>calculateRevisionDates(),/Date is required/);
  });

  test("throws error if invalid date format", () => {
    assert.throws(()=> calculateRevisionDates("not-a-date"),/Invalid date format/);
  });

