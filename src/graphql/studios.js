// 🔹 Home dashboard – recent studios
export const GET_RECENT_STUDIOS = () => `
{
  findStudios(
    filter: {
      sort: "created_at"
      direction: DESC
      per_page: 5
      page: 1
    }
  ) {
    studios {
      id
      name
      image_path
    }
  }
}
`;

// 🔹 Paginated studios list
export const GET_STUDIOS_PAGE = (page = 1) => `
{
  findStudios(
    filter: {
      sort: "name"
      direction: ASC
      per_page: 20
      page: ${page}
    }
  ) {
    studios {
      id
      name
      image_path
    }
    count
  }
}
`;
