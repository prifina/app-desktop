import React from "react";
import renderer from "react-test-renderer";
import {input} from "../stories/Input.stories";
import Input from "../src/components/Input";
import { ThemeProvider } from "@blend-ui/core";

test("Input renders correctly", () => {
    const tree = renderer.create(<ThemeProvider><input type="text" /></ThemeProvider>).toJSON();
    expect(tree).toMatchSnapshot();
});

test("Disabled renders correctly", () => {
    const tree = renderer.create(
        <ThemeProvider>
            <input disabled type="text" />
        </ThemeProvider>).toJSON();
    expect(tree).toMatchSnapshot();
});

test("Input with placeholder renders correctly", () => {
    const tree = renderer.create(
        <ThemeProvider>
            <Input placeholder={"Enter value here"} />
        </ThemeProvider>).toJSON();
    expect(tree).toMatchSnapshot();
});

test("Input Styled no border renders correctly", () => {
    const tree = renderer.create(
        <ThemeProvider>
            <Input placeholder={"Enter value here"} borders={0} p={0} />
        </ThemeProvider>).toJSON();
    expect(tree).toMatchSnapshot();
});