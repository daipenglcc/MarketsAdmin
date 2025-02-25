export function sortChineseNumbers(arr) {
  console.log('arr', arr);
  const chineseNumbers = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
  };

  return arr.sort((a, b) => chineseNumbers[a] - chineseNumbers[b]);
}
