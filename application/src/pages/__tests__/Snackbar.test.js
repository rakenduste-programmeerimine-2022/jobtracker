import { itIT } from "@mui/x-date-pickers"
import { render, screen, cleanup } from "@testing-library/react"
import { Snackbar } from "../../components/useSnackbar"

describe(Snackbar, () => {
  /*   it("eduteate kuvamine", () => {
    const { getByTestId } = render(<Snackbar open={true} severity="success" />)
    const snackbarElement = getByTestId("teade")
    expect(snackbarElement).toBeInTheDocument()
  }) */
  //   it("snackbar peaks sulgema, kui sulgemise nupule vajutada", () => {
  //     const { getByTestId, getByRole, getAllByDisplayValue } = render(
  //       <Snackbar open={true} severity="success" text="Teate sisu" />
  //     )
  //     const snackbarElement = getByTestId("teade")
  //     //const alert = getAllByDisplayValue("Teate sisu")
  //     const alert = getByRole("div", { name: "Teate sisu" })
  //     console.log(alert)
  //     expect(snackbarElement).toBeInTheDocument()
  //   })
})
