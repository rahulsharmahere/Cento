export const GET_TAGS_PAGE = (page = 1, perPage = 25) => `
{
  findTags(
    filter: {
      page: ${page}
      per_page: ${perPage}
    }
  ) {
    count
    tags {
      id
      name
    }
  }
}
`;
