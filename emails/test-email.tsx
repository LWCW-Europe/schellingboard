export function testEmail({ name }: { name: string }) {
  return {
    subject: "Test email",
    body: (
      <>
        <h1>Test email</h1>
        <p>
          This is a test email sent to <strong>{name}</strong>.
        </p>
      </>
    ),
  };
}
