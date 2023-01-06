import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react/pure";
import userEvent from "@testing-library/user-event";
//import App from "../src/App";
import "@testing-library/jest-dom";
import { MockProvider } from "./StoreMock";

describe.only('Prifina Store testing...', () => {
  beforeAll(() =>
    render(<MockProvider />)
  );
  // auto cleanup is not happening because of "/pure"
  afterAll(() => {
    cleanup()
  });
  it("Test rendering...", async () => {
    await waitFor(() => screen.getByText(/READY/i));
  });

  it("Renders Store Provider... ", () => {
    const authText = screen.getByText(/AUTH FALSE/i);
    //console.log(authText)
    expect(authText).toBeInTheDocument();
    const authStatusText = screen.getByText(/AUTH_STATUS_FALSE/i);
    //console.log(authText)
    expect(authStatusText).toBeInTheDocument();
    const defaultUserText = screen.getByText(/USER_OBJ === {}/);
    const defaultGetUserText = screen.getByText(/GET_USER === {}/);
    expect(defaultUserText).toBeInTheDocument();
    expect(defaultGetUserText).toBeInTheDocument();
  });

  it("Test authentication, set true", async () => {
    //console.log(screen.getByRole('clickTest'));
    userEvent.click(screen.getByRole('clickSetAuthTrue'))
    await waitFor(() => screen.getByText(/AUTH TRUE/i));
    const authStatusText = screen.getByText(/AUTH_STATUS_TRUE/i);
    //console.log(authText)
    expect(authStatusText).toBeInTheDocument();
  })
  it("Test authentication, set false", async () => {
    //console.log(screen.getByRole('clickTest'));
    userEvent.click(screen.getByRole('clickSetAuthFalse'))
    await waitFor(() => screen.getByText(/AUTH FALSE/i));
    const authStatusText = screen.getByText(/AUTH_STATUS_FALSE/i);
    //console.log(authText)
    expect(authStatusText).toBeInTheDocument();
  })


  it("Set user... ", async () => {
    userEvent.click(screen.getByRole('clickSetUser'));
    await waitFor(() => screen.getByText(/USER_OBJ === {"test":"OK"}/));
    await waitFor(() => screen.getByText(/GET_USER === {"test":"OK"}/));
  });

  it("Test debug", () => {
    screen.debug();
  })
});

/*enders learn react link", () => {
test("r
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/
