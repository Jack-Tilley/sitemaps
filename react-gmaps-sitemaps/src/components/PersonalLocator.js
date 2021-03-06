import { Paper, Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import { useGoogleMap } from "@react-google-maps/api";

export default function PersonalLocator() {
  const map = useGoogleMap();
  const handleClick = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      (position) =>
        map.panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      //   setCenter({
      //     lat: position.coords.latitude,
      //     lng: position.coords.longitude,
      //   })
    );
    //   setCenter()
  };
  return (
    <div style={{ position: "absolute", left: "19em", top: "3em" }}>
      <Paper>
        <Tooltip title="Go to my location">
          <IconButton onClick={handleClick} size="small">
            <i className="material-icons icon-grey">{"explore"}</i>
          </IconButton>
        </Tooltip>
      </Paper>
    </div>
  );
}
