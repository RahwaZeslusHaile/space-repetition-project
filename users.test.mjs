global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = value; },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};

// Mock alert
global.alert = (msg) => console.log("ALERT:", msg);

import { getUserIds } from "./users.mjs";
import assert from "node:assert";
import test from "node:test";
import { calculateRevisionDates } from "./revision-dates.mjs";
import { clearData,addData ,getData} from "./storage.mjs";

test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});


  test("calculates correct revision dates", () => {
    const input = "2028-02-29";
    const result = calculateRevisionDates(input);

    assert.deepStrictEqual(result,{
    oneWeek: "2028-03-07",
    oneMonth: "2028-03-29",
    threeMonths: "2028-05-29",
    sixMonths: "2028-08-29",
    oneYear: "2029-03-01",}
    )}
    );

  

  test("throws error if no input", () => {
    assert.throws(()=>calculateRevisionDates(),/Date is required/);
  });

  test("throws error if invalid date format", () => {
    assert.throws(()=> calculateRevisionDates("not-a-date"),/Invalid date format/);
  });

  test("addData saves and prevents duplicates", () => {
  const userId = "1";

  // Clear first
  clearData(userId);

  const data1 = [{ topic: "Math", inputDate: "2025-10-08", revisionDates: {} }];
  addData(userId, data1);

  const stored = getData(userId);
  assert.deepStrictEqual(stored, data1);

  // Try adding duplicate
  addData(userId, data1); // Will trigger alert, filtered out

  const afterDuplicate = getData(userId);
  assert.deepStrictEqual(afterDuplicate, data1); // Should remain the same
});

test("clearData removes data", () => {
  const userId = "1";
  clearData(userId);
  assert.strictEqual(getData(userId), null);
});

