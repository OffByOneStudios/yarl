
export default function({ getState }) {
  return (next) => (action) => {
    console.log('will dispatch', action)

    // Socket send here.
    let returnValue = next(action)
    return returnValue
  }
}
