import React, {createRef} from "react";
import renderer from "react-test-renderer";
import { ThemeProvider } from "@blend-ui/core";
import Select from "../src/components/Select";

test("Link renders correctly", () => {
    const tree = renderer.create(
        <ThemeProvider>
            <Select id="cabinClass" name="cabinClass">
                <option value="1">First Name</option>
            </Select>
        </ThemeProvider>).toJSON();
    expect(tree).toMatchSnapshot();
});

