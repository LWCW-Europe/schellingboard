# ADR 0003: Form handling and validation with React Hook Form and Zod

- **Status:** Accepted
- **Date:** 2026-07-02

## Context

Currently, the app handles form errors and validation in a really simple way: the form is sent to the server, the server
validates it, and then sends back a response that looks like `{ error: "..." }`. This implementation is simple, but
rather bare-bones, since all errors end up showing above the form itself. Specifically:

- There is no clear relationship between the erroneous field/value and the error, the error is supposed to be understood
  by the user through the message content itself. This can cause usability
  issues [Seckler, Tuch, Opwis, & Bargas-Avila 2012]
- When multiple validation errors exist, users are often exposed to only the first one returned by the server. This
  results in repeated submit/fix cycles before a form can be successfully saved.
- Validation rules are challenging to reuse between client and server, increasing the likelihood of duplicated logic or
  inconsistent behaviour.

The solution should satisfy the following constraints:

- Preserve strong type safety throughout the application.
- Maintain a clear, consistent, and easily understandable codebase for contributors, human or otherwise.
- Allow validation logic to be defined once and reused where appropriate.
- Support associating validation errors with individual form fields.

## Decision

Adopt **React Hook Form** for form state management and **Zod** for schema definition and validation.

React Hook Form will manage form state, input registration, and error handling on the client. Zod schemas will define
validation rules and serve as the source of truth for data validation. React Hook Form will integrate with Zod through
the `@hookform/resolvers/zod` package.

Where practical, Zod schemas should be shared between client-side validation and server-side request validation. The
server remains the authoritative source of validation; client-side validation exists to provide immediate feedback and
improve the user experience.

Server actions return validation failures keyed by field name (the Zod error's flattened
`fieldErrors`) instead of a single error string. The client maps these into React Hook Form
via `setError`, so errors detected only on the server appear on the same fields as
client-detected ones.

## Consequences

### Positive

- Validation errors can be displayed next to the corresponding fields.
- Multiple validation errors can be presented simultaneously.
- Validation rules are expressed declaratively in a single schema.
- TypeScript types can be inferred directly from validation schemas, reducing duplication.
- Shared schemas reduce the risk of client and server validation diverging.
- React Hook Form minimises unnecessary re-renders and provides a mature, well-supported API for form handling.

### Negative

- Introduces additional dependencies and a modest learning curve.
- Form implementations become more structured, which may increase the initial complexity for simple forms.
- Care must be taken to ensure that client and server continue to use the same validation schemas where possible.
- In the case of custom or exotic form field implementations (where the input is hidden, for example; common such cases are
  image uploads), there should be extra care on how and where the relevant field's errors will be shown.

### Neutral

- Zod becomes available for further validation in other parts of the application.

## Alternatives considered

### Leave as is

- **Pros:** Simple, straightforward implementation.
- **Cons:**
  - No clear relationship between the erroneous field/value and the error
  - Annoying workflow for users to fix errors
  - Validation logic is duplicated between client and server

### Tanstack Form

- **Pros:** More powerful and flexible than React Hook Form.
- **Cons:**
  - More complex to use and maintain, steeper learning curve
  - Younger ecosystem, less mature
  - Requires big refactoring of existing forms

### Conform

- **Pros:**
  - Fits very well with Next.js's server actions.
  - Out-of-the-box functionality that will need (some) effort to implement in RHF.
- **Cons:**
  - Opinionated and limited to server validation.
  - Focuses more on SSR.
  - Requires remix dependency.
  - Doesn't allow for state management on the client. Makes custom fields a bit more complex.

### Other validation libraries (TypeBox, Joi, Valibot, etc.)

They are all functionally similar to Zod, with slightly different APIs.
No clear benefit to using them over zod, since zod is the most widely used.

## References

- Seckler, Tuch, Opwis, & Bargas-Avila 2012: _Interacting with Computers_, Volume 24, Issue 3, May 2012, Pages
  107–118, [https://doi.org/10.1016/j.intcom.2012.03.002](https://doi.org/10.1016/j.intcom.2012.03.002)
- Zod: https://zod.dev/
- React Hook Form: https://react-hook-form.com/
