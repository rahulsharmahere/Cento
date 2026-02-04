export const graphqlRequest = async (serverUrl, apiKey, query) => {
  const res = await fetch(`${serverUrl}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ApiKey: apiKey,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
};
