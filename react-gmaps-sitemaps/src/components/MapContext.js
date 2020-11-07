import React, { useState, useCallback, createContext, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import axios from "axios";

import "react-checkbox-tree/lib/react-checkbox-tree.css";

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BusinessCenter, Add } from "@material-ui/icons";

// const nodes1 = [
//   {
//     value: "Site1",
//     label: "Site1",
//     icon: <BusinessCenter />,
//     apiPath: "HI/there",
//     latLngArr: ["40"],
//     nodeType: "SITE",
//     children: [
//       {
//         value: "+",
//         label: "+",
//         apiPath: "HI/there",
//         latLngArr: ["40"],
//         nodeType: "ADD",
//         icon: <Add />,
//         disabled: true,
//       },
//       {
//         value: "Trench",
//         label: "Trench",
//         icon: <BusinessCenter />,
//         apiPath: "HI/there",
//         latLngArr: ["40", "50"],
//         nodeType: "POLYLINE",
//       },
//       {
//         value: "Tools1",
//         label: "Tools",
//         icon: <BusinessCenter />,
//         apiPath: "HI/there",
//         latLngArr: ["40"],
//         nodeType: "MARKER",
//       },
//     ],
//   },
//   {
//     value: "Site2",
//     label: "Site2",
//     children: [
//       {
//         value: "Tools2",
//         label: "Tools",
//         apiPath: "HI/there",
//         latLngArr: ["40"],
//         nodeType: "MARKER",
//         icon: <i className="fa fa-file-image-o" />,
//       },
//       {
//         value: "Mods",
//         label: "Mods",
//         apiPath: "HI/there",
//         latLngArr: ["40"],
//         nodeType: "SITE",
//         icon: <i className="fa fa-file-image-o" />,
//       },
//     ],
//   },
// ];

let addNode = {
  value: "/+",
  label: "+",
  parent: null,
  apiPath: "HI/there",
  latLngArr: ["40"],
  nodeType: "ADD",
  icon: <Add />,
  disabled: true,
};

const libraries = ["drawing"];

export const MapContext = createContext();

export const MapProvider = (props) => {
  const [myMap, setMyMap] = useState(null);
  const [center, setCenter] = useState({ lat: 39.9526, lng: -75.1652 });
  const [nodes, setNodes] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [draw, setDraw] = useState(false);
  const [icon, setIcon] = useState(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/nodes/")
      .then((res) => {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].children.unshift({
            value: res.data[i].value + "/+",
            label: "+",
            apiPath: res.data[i].value + "/+",
            latLngArr: ["40"],
            nodeType: "ADD",
            icon: <Add />,
            disabled: true,
          });
          console.log(res.data[i]);
        }
        res.data.unshift(addNode);
        setNodes(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <MapContext.Provider
      value={[
        myMap,
        setMyMap,
        center,
        setCenter,
        isLoaded,
        draw,
        setDraw,
        nodes,
        setNodes,
        activeNode,
        setActiveNode,
        icon,
        setIcon,
      ]}
    >
      {props.children}
    </MapContext.Provider>
  );
};
