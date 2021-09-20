/* eslint-disable react/no-multi-comp */
import React, { useRef, useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { useDrag, useDrop } from "react-dnd";
import html2canvas from "html2canvas";

import ReactDOM from "react-dom";

//import { exportComponentAsPNG } from "react-component-export-image";

const style = {
  /*

  border: "1px dashed gray",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  */
  margin: "5px",
  cursor: "move",
};
const ItemTypes = {
  WIDGET: "widget",
};

const Widget = ({ id, index, moveWidget, children, ...props }) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.WIDGET,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      //console.log("DRAG ELEM ", item.id);
      //console.log("DRAG ELEM ", monitor.getItem());
      //console.log("DRAG ELEM ", monitor.getHandlerId());
      //const dragElement = document.getElementById("#" + item.id);
      //console.log("DRAG ELEM ", dragElement);
      //const dragBoundingRect = dragElement.getBoundingClientRect();

      // determine mouse position
      const clientOffset = monitor.getClientOffset();
      //const dragElement = document.getElementById(item.id);
      //console.log("DRAG ELEM ", item.id);

      // get hovered image vertical middle position
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // get hovered image horizontal middle position
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // only perform the move when the mouse has crossed half of the items height/width
      // are we dragging right or left?
      const dragRight = dragIndex === hoverIndex - 1;
      const dragLeft = dragIndex === hoverIndex + 1;

      // are we dragging up or down?
      //const dragUp = dragBoundingRect.top > hoverBoundingRect.top;
      //const dragDown = dragBoundingRect.bottom < hoverBoundingRect.bottom;

      if (dragRight && dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      if (dragLeft && dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }
      /*
      if (dragUp && dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      if (dragDown && dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
*/
      /*
      if (
        Math.abs(clientOffset.x - hoverBoundingRect.left) >
        hoverBoundingRect.width / 1.8
      )
        return;
        */
      /*
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
     
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      */

      // Time to actually perform the action
      moveWidget(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.WIDGET, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      className={"widget"}
      ref={ref}
      style={{ ...style, opacity }}
      data-handler-id={handlerId}
      onClick={(e) => {
        console.log("CLICK2 ");

        const DEFAULT_PNG = {
          fileName: "component.png",
          type: "image/png",
          html2CanvasOptions: {},
        };

        const element = ReactDOM.findDOMNode(ref.current);

        html2canvas(element, {
          scrollY: -window.scrollY,
          useCORS: true,
          ...DEFAULT_PNG,
        }).then((canvas) => {
          const f = canvas.toDataURL(DEFAULT_PNG.type, 1.0);
          console.log("FILE2 ", f);
          //const localBlob = URL.createObjectURL(data);
          //console.log(localBlob);
        });
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const Test = () => {
  console.log("RENDER HERE");
  return (
    <div style={{ width: "100px", backgroundColor: "red", height: "100px" }}>
      A
    </div>
  );
};

export default { title: "Widgets" };

const widgetList = [
  <Test />,
  <div style={{ width: "200px", backgroundColor: "green", height: "100px" }}>
    B
  </div>,
  <div style={{ width: "100px", backgroundColor: "blue", height: "200px" }}>
    C
  </div>,
  <div style={{ width: "200px", backgroundColor: "orange", height: "200px" }}>
    D
  </div>,
  <div style={{ width: "100px", backgroundColor: "yellow", height: "100px" }}>
    E
  </div>,
];

export const widgetStory = () => {
  const [widgets, setWidgets] = useState(widgetList);

  const moveWidget = useCallback(
    (dragIndex, hoverIndex) => {
      const dragWidget = widgets[dragIndex];
      setWidgets(
        update(widgets, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragWidget],
          ],
        })
      );
    },
    [widgets]
  );

  const renderWidget = (w, index) => {
    //return (<Card key={card.id} index={index} id={card.id} text={card.text} moveCard={moveCard}/>);

    return (
      <Widget
        key={"w-" + index}
        index={index}
        id={"widget-" + index}
        moveWidget={moveWidget}
      >
        {w}
      </Widget>
    );
  };
  return (
    <>
      <button
        onClick={() => {
          const w = document.getElementsByClassName("widget");
          console.log(w);
          const DEFAULT_PNG = {
            fileName: "component.png",
            type: "image/png",
            html2CanvasOptions: {},
          };

          //const element = ReactDOM.findDOMNode(ref.current);

          html2canvas(w[1].children[0], {
            scrollY: -window.scrollY,
            useCORS: true,
            ...DEFAULT_PNG,
          }).then((canvas) => {
            const f = canvas.toDataURL(DEFAULT_PNG.type, 1.0);
            console.log("FILE2 ", f);
            //const localBlob = URL.createObjectURL(data);
            //console.log(localBlob);
          });
        }}
      >
        IMAGES
      </button>
      <DndProvider backend={HTML5Backend}>
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            border: "2px solid black",
            flexWrap: "wrap",
            flexDirection: "row",
          }}
        >
          {widgets.map((w, i) => renderWidget(w, i))}
        </div>
      </DndProvider>
    </>
  );
};
widgetStory.story = {
  name: "Widgets",
};
