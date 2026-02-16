export const GET_RECENT_SCENES = () => `
{
  findScenes(
    filter: {
      sort: "updated_at"
      direction: DESC
      per_page: 6
      page: 1
    }
  ) {
    scenes {
      id
      title
      studio { name }
      files { duration }
    }
  }
}
`;

export const GET_SCENES_PAGE = (page = 1, search = '') => `
{
  findScenes(
    scene_filter: {
      title: {
        value: "${search}"
        modifier: INCLUDES
      }
    }

    filter: {
      sort: "updated_at"
      direction: DESC
      per_page: 20
      page: ${page}
    }
  ) {
    scenes {
      id
      title
      studio { name }
      files { duration }
    }
    count
  }
}
`;

export const GET_SCENE_DETAILS = (sceneId) => `
{
  findScene(id: "${sceneId}") {
    id
    title
    date
    details
    studio { id name }
    tags { id name }
    performers { id name }
    files { duration }
  }
}
`;
