export const GET_TAGS_PAGE = (page = 1) => `
{
  findTags(
    filter: {
      per_page: 50
      page: ${page}
    }
  ) {
    count

    tags {
      id
      name
      scene_count
    }
  }
}
`;
