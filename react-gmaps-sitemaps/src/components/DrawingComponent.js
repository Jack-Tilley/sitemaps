import { Paper } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { DrawingManager } from "@react-google-maps/api";
import axios from "axios";
import React from "react";
// import { MapContext } from "./MapContext";
import {
  useAddEditContext,
  useNodeContext,
  useDrawContext,
  useProfileContext,
  useSelectedContext,
  useTeamContext,
  useTreeContext,
} from "./MapContext";
import { updateNodes, editCleanup, replaceNode } from "../utils/contextUtils";

const DrawingComponent = () => {
  const {
    color,
    setColor,
    nodeType,
    setNodeType,
    editing,
    setEditing,
    editValue,
    setEditValue,
    description,
    setDescription,
    icon,
    setIcon,
  } = useAddEditContext();

  const { setTeams, selectedTeams, setSelectedTeams } = useTeamContext();

  const { draw, setDraw } = useDrawContext();
  const { checked, setChecked, shapes, setShapes } = useTreeContext();

  const { selected, setSelected } = useSelectedContext();

  const { nodes, setNodes, activeNode, setActiveNode } = useNodeContext();
  const { profileId } = useProfileContext();

  const options = {
    polylineOptions: {
      strokeColor: color,
      // strokeWeight: 0.01,
      // editable : true,
    },
    // markerOptions: {
    //   title: "Hello",
    //   label: "hi",
    // },
    drawingControlOptions: {
      position: -1, // sets drawing manager not on page
      //   drawingModes: null,
    },
  };
  const handleCancel = () => {
    setEditing(false);
    setDraw(false);
    // if (!editing) {
    //   setNodes(removeNode(activeNode.value));
    // }
    setColor("black");
    setIcon("search");
    setNodeType(null);
    setActiveNode(null);
    setDescription("");
  };

  const onPolylineComplete = (polyline) => {
    let roughPath = polyline.getPath().getArray().toString().split(",");
    let path = [];
    for (let i = 0; i < roughPath.length; i += 2) {
      path.push(roughPath[i].slice(1), roughPath[i + 1].slice(0, -1));
    }
    handleActiveNodeChange(path, "polyline", polyline, icon);
    // console.log(polyline);

    polyline.setMap(null); // makes polyline invisible
    setDraw(false); // we do this instead of !draw because we want drawing component to leave when a new one is added
  };

  const onMarkerComplete = (marker) => {
    if (editing) {
      marker.title = editValue;
      marker.label = editValue;
    } else {
      marker.title = activeNode.label;
      marker.label = activeNode.label;
    }
    // console.log("marker");
    marker.icon = <i className={`material-icons icon-${color}`}>{icon}</i>;
    // console.log("marker", marker);
    // marker.icon = icon // need to figure out how to get custom icon
    let position = [marker.position.lat(), marker.position.lng()];
    // console.log("POSITION", position);
    handleActiveNodeChange(position, "marker", marker, icon);
    setDraw(false); // we do this instead of !draw because we want drawing component to leave when a new one is added
  };

  const onOverlayComplete = (e) => {
    // add overlay to nodes
    // console.log("Drawing component unmounted");
  };

  const handleActiveNodeChange = async (
    position,
    nodeType,
    nodeReference,
    icon
  ) => {
    nodeReference.visible = false;
    if (editing) {
      if (editValue === "") {
        setEditValue("UNNAMED" + nodeType);
      }
      axios
        .put(`https://backend-mapdit.herokuapp.com/api/allNodes/${selected.id}/`, {
          label: editValue,
          color: color,
          iconValue: icon,
          latLngArr: position,
          description: description,
        })
        .then((res) => {
          // console.log("result", res.data);
          // REPLACE NODE IN HERE WITH THE RESULT
          setEditing(false);
          // console.log("parent", res.data.parent);
          if (res.data.parent === null) {
            // console.log("THIS IS A LONE NODE");
            let newNodes = replaceNode(selected.id, res.data, nodes);
            setNodes(newNodes);
          } else {
            axios
              .get(`https://backend-mapdit.herokuapp.com/api/nodes/${res.data.parent}`)
              .then((result) => {
                let newNodes = replaceNode(res.data.parent, result.data, nodes);
                setNodes(newNodes);
              })
              .catch((err) => console.log(err));
          }
          // console.log("SELECTEDVALUE", selected.value);
          // cleanup
          editCleanup(
            res.data,
            checked,
            shapes,
            selected,
            setChecked,
            setShapes,
            setSelected,
            setIcon,
            setColor,
            setNodeType,
            setDescription,
            setEditValue
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let newActiveNode = activeNode;
      newActiveNode.latLngArr = position;
      newActiveNode.nodeType = nodeType;
      newActiveNode.iconValue = icon;
      axios
        .post("https://backend-mapdit.herokuapp.com/api/nodes/", {
          label: newActiveNode.label,
          nodeType: newActiveNode.nodeType,
          value: newActiveNode.value,
          parent: newActiveNode.parent_id,
          latLngArr: newActiveNode.latLngArr,
          isDir: newActiveNode.isDir,
          iconValue: icon,
          color: color,
          description: description,
        })
        .then((res) => {
          // console.log("selected teams", selectedTeams);
          if (res.data.parent === null) {
            for (let teamId of selectedTeams) {
              axios
                .post(
                  `https://backend-mapdit.herokuapp.com/api/teams/${teamId}/update_nodes/`,
                  {
                    id: res.data.id,
                  }
                )
                .then((result) => {
                  // console.log(result.data);
                })
                .catch((err) => console.log(err));
            }
          }

          // console.log("NEW NODE ADDED", res.data);
          newActiveNode.id = res.data.id;
          updateNodes(profileId, setNodes, setTeams);
          // console.log("return value", ret);
          setActiveNode(newActiveNode);
          setSelectedTeams();
          setChecked([...checked, newActiveNode.value]);
          setShapes([...shapes, newActiveNode]);
          setIcon("search");
          setColor("black");
          setDescription("");
          setNodeType(null);
        })
        .catch((err) => console.log(err));
    }
  };

  const renderDrawingComponent = () => (
    <>
      <DrawingManager
        onOverlayComplete={onOverlayComplete}
        onPolylineComplete={onPolylineComplete}
        onMarkerComplete={onMarkerComplete}
        options={{ options }}
        drawingMode={nodeType}
      ></DrawingManager>
      <Paper
        style={{
          position: "absolute",
          bottom: "1em",
          margin: "auto",
          padding: 0,
          textAlign: "center",
          left: "50%",
          //   alignContent: "center",
          //   justifyContent: "center",
        }}
      >
        <IconButton
          size="small"
          onClick={() => handleCancel()}
          key={"cancelDraw"}
        >
          <i className="large material-icons icon-cancel">{"cancel"}</i>
        </IconButton>
      </Paper>
    </>
  );
  return draw ? renderDrawingComponent() : null;
};
export default DrawingComponent;
