// helpers/locationHelpers.js

export const filterByParentId = (
  data,
  parentKey,
  parentId
) => {
  return data.filter(
    (item) => item[parentKey] == parentId
  );
};