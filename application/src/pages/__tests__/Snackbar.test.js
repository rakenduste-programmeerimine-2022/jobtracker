import { itIT } from "@mui/x-date-pickers"
import { render, screen, cleanup } from "@testing-library/react"
import { Snackbar } from "../../components/useSnackbar"

describe(Snackbar, () => {
  it("eduteate kuvamine", () => {
    const { getByTestId, get } = render(
      <Snackbar open={true} severity="success" />
    )
    const snackbarElement = getByTestId("teade")
    expect(snackbarElement).toBeInTheDocument()
  })
})
