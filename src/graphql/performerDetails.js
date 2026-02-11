export const GET_PERFORMER_DETAILS = (id) => `
{
  findPerformer(id: ${id}) {
    id
    name
    gender
    birthdate
    image_path

    scenes {
      id
      title
      studio {
        name
      }
    }
  }
}
`;
