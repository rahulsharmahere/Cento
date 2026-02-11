export const GET_TAG_SCENES = (tagId) => `
{
  findScenes(
    scene_filter: {
      tags: {
        value: [${tagId}]
        modifier: INCLUDES
      }
    }

    filter: {
      per_page: -1
    }
  ) {
    scenes {
      id
      title

      studio {
        name
      }

      paths {
        screenshot
      }
    }
  }
}
`;
