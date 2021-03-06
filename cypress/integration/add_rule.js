/// <reference types="Cypress" />

import { clickStartCtaButton } from "../helpers/landing";
import {
  clickCreateRuleButton,
  enterRuleName,
  enterCriterionName,
  submitRule,
  enterNote,
  clickAddRowButton,
  deleteRule,
  deleteLastCriterion
} from "../helpers/rule_details";
import { clickRules } from "../helpers/nav";
import { assertRuleName } from "../helpers/rules";

describe("Users can create rules", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  const testRulePrefix = '[Test-rule]';

  after(() =>
    clickRules().then(() => {
      cy.contains(testRulePrefix).its('length').then(entriesCount => {
        if (entriesCount > 0) {
          deleteRule(testRulePrefix)
        }
      })
    }
    )
  )


  it("with single criterion and delete it", () => {
    clickStartCtaButton();
    clickCreateRuleButton();

    const tail = Date.now();

    const ruleName = `${testRulePrefix} Grocery shop ${tail}`

    enterRuleName(ruleName);
    enterCriterionName(`Proximity`);
    enterNote(`Closer -> better`);

    submitRule();

    cy.get(".rule [data-test=rule-name]")
      .first()
      .should("contain", ruleName);

    deleteRule(ruleName)

    cy.contains(ruleName).should('not.exist')
  });

  it("with multiple criteria", () => {
    clickStartCtaButton();
    clickCreateRuleButton();

    const ruleName = `${testRulePrefix} Schools ${Date.now()}`
    enterRuleName(ruleName);
    enterCriterionName(`GCSE scores`);
    enterNote(`Higher - better`);

    clickAddRowButton();

    enterCriterionName(`Proximity`);
    enterNote(`Closer - better`);

    submitRule();

    assertRuleName(0, ruleName);
  });

  it("and delete criterion", () => {
    clickStartCtaButton();
    clickCreateRuleButton();

    const tail = Date.now();

    enterRuleName(`${testRulePrefix} delete criterion ${tail}`);
    enterCriterionName(`Criterion 1 ${tail}`);

    clickAddRowButton();

    const crterionToDelete = 'criterion to delete'
    enterCriterionName(crterionToDelete);

    deleteLastCriterion()

    cy.contains(crterionToDelete).should('not.exist')
  });
});

