import React from "react";
import renderer from "react-test-renderer";
import ScreenImages from "../src/components/Image";
import { ThemeProvider } from "@blend-ui/core";
// import {imageFile} from '../src/assets/maxresdefault1.png';


test("Image renders correctly", () => {
    const tree = renderer.create(
        <ThemeProvider>
            <ScreenImages src={"https://picsum.photos/200/200"} />
        </ThemeProvider>).toJSON();
    expect(tree).toMatchSnapshot();
});
