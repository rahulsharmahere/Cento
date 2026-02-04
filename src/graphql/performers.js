// 🔹 Home dashboard – recent performers
export const GET_RECENT_PERFORMERS = () => `
{
  findPerformers(
    filter: {
      sort: "created_at"
      direction: DESC
      per_page: 5
      page: 1
    }
  ) {
    performers {
      id
      name
      image_path
    }
  }
}
`;

// 🔹 Paginated performers list
export const GET_PERFORMERS_PAGE = (page = 1) => `
{
  findPerformers(
    filter: {
      sort: "name"
      direction: ASC
      per_page: 20
      page: ${page}
    }
  ) {
    performers {
      id
      name
      image_path
    }
    count
  }
}
`;
