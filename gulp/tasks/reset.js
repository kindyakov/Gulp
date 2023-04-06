import { deleteAsync } from "del"

const reset = () => {
  return deleteAsync(app.path.clean)
}

export default reset