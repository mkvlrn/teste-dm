export async function fetchUser(url: string) {
  const response = await fetch(url);
  const data = await response.json();

  return data.user;
}
