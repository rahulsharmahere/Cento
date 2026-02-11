// 🔹 Home dashboard – recent scenes
export const GET_RECENT_SCENES = () => `
{
  findScenes(
    filter: {
      sort: "created_at"
      direction: DESC
      per_page: 6
      page: 1
    }
  ) {
    scenes {
      id
      title
    }
  }
}
`;

// 🔹 Paginated scenes list (Scenes tab + Search)
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
      sort: "created_at"
      direction: DESC
      per_page: 20
      page: ${page}
    }
  ) {
    scenes {
      id
      title
    }
    count
  }
}
`;

// 🔹 Scene detail
export const GET_SCENE_DETAILS = (sceneId) => `
{
  findScene(id: "${sceneId}") {
    id
    title
    date
    details
    tags { id name }
    performers { id name }
    studio { id name }
  }
}
`;
