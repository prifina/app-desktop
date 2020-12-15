import React, {createRef} from "react";
import renderer from "react-test-renderer";
import Button from "../src/components/Button";
import { ThemeProvider } from "@blend-ui/core";

test("Button renders correctly", () => {
    const tree = renderer.create(<ThemeProvider>
        <Button>Submit</Button>
        </ThemeProvider>).toJSON();
    expect(tree).toMatchSnapshot();
})