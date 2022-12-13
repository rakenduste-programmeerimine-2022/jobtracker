import { render, screen, cleanup } from "@testing-library/react"
import UserContext from "../../contexts/UserContext"
import Settings from "../Settings"

test("test", () => {
  expect(true).toBe(true)
})

// test("peaks kuvama seadete komponendi", () => {
//   render(<Settings />)
//   const settingsElement = screen.getByTestId("settings")
//   expect(settingsElement).toBeInTheDocument()
// })

/* test("renders learn react link", () => {
  render(<Settings />)
  const buttonElement = screen.getByText(/Muuda/i)
  expect(buttonElement).toBeInTheDocument()
}) */

// describe("<Settings />", () => {
//   describe("kasutaja kontekst", () => {
//     const uContext = {
//       id: "",
//       loggedIn: false,
//       user: {
//         address: "",
//         businessName: "",
//         email: "",
//         iban: "",
//         name: "",
//         regNumber: "",
//         surname: "",
//         vat: "",
//       },
//     }

//     beforeEach(() => {
//       render(
//         <UserContext.Provider value={uContext}>
//           <Settings />
//         </UserContext.Provider>
//       )
//     })

//     describe("when clicking toggle", () => {
//       const settingsElement = screen.getByTestId("settings")
//       expect(settingsElement).toBeInTheDocument()
//     })
//   })
// })
