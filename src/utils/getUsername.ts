export const getUsername = (
  username?: string,
  name?: string,
  surname?: string,
) => {
  if (username) {
    return `@${username}`;
  } else if (name || surname) {
    const fullName = [name, surname].filter(Boolean).join(' ');
    return fullName;
  } else {
    return '@username';
  }
};
