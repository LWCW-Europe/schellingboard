/**
 * A hidden, read-only username field to sit next to a password input.
 *
 * Browsers key a saved credential on the username field of the form the
 * password was typed into. This app has several distinct passwords on one
 * origin — the site password, the admin password, and one per protected guest
 * — so without a username the password manager treats them as the same
 * credential and mixes them up or overwrites the saved entry. Naming which
 * credential is being entered makes each one save as its own entry.
 *
 * The name is user-visible — password managers list it as the username of the
 * saved entry — so pass something readable ("Site Password", a guest's name).
 */
export function PasswordManagerHint({ username }: { username: string }) {
  return (
    <input
      type="text"
      name="username"
      autoComplete="username"
      value={username}
      readOnly
      aria-hidden="true"
      tabIndex={-1}
      className="hidden"
    />
  );
}
