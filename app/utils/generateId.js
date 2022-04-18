const generateId = () =>
  Math.random()
    .toString(36)
    .substr(2)

export default generateId
