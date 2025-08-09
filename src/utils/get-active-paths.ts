import { closest } from 'fastest-levenshtein';

// TODO this would not handle ID in the path correctly but that's not needed now
export const getActivePath = (
  path: string,
  paths: string[],
  ignorePaths?: string[]
) => {
  const closestPath = closest(path, paths.concat(ignorePaths || []));
  const index = paths.indexOf(closestPath);
  return { active: closestPath, activeIndex: index };
};
