import type {
  Layer,
  LayerGroup,
  FitBoundsOptions,
  LatLngBoundsExpression,
  MapOptions,
} from "leaflet";
import { Control, Map as LeafletMap, tileLayer, control, Util } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { HTMLProps } from "react";
import { useCallback, useEffect, useState } from "react";
import { useResizeObserverRef } from "rooks";

import "./Map.css";

export type ControlledLayer = {
  addLayer(layer: Layer): void;
  removeLayer(layer: Layer): void;
};

export type LeafletContextInterface = Readonly<{
  __version: number;
  map: LeafletMap;
  layerContainer?: ControlledLayer | LayerGroup;
  layersControl?: Control.Layers;
  overlayContainer?: Layer;
  pane?: string;
}>;

const CONTEXT_VERSION = 1;

function createLeafletContext(map: LeafletMap): LeafletContextInterface {
  return Object.freeze({ __version: CONTEXT_VERSION, map });
}

type DivProps = HTMLProps<HTMLDivElement>;

export interface MapContainerProps extends MapOptions, DivProps {
  bounds?: LatLngBoundsExpression;
  boundsOptions?: FitBoundsOptions;
  whenReady?: () => void;
  isDrawActive?: boolean;
  isGeoSearchActive?: boolean;
  onGetMapBounds?: () => void;
  containerClassName?: string;
}

export function Map({
  center = [0, 0],
  zoom = 1,
  bounds,
  boundsOptions = { padding: [500, 500], maxZoom: 21 },
  whenReady,
  containerClassName,
  className,
  ...options
}: MapContainerProps) {
  const [context, setContext] = useState<LeafletContextInterface | null>(null);

  const handleResizeMapContainer = Util.throttle(
    () => {
      console.log("invalidate size");
      context?.map.invalidateSize();
    },
    500,
    undefined
  );

  const [mapContainerRef] = useResizeObserverRef(handleResizeMapContainer);

  const mapRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null && context === null) {
      const openStreetMap = tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );
      const map = new LeafletMap(node, {
        zoomControl: false,
        layers: [openStreetMap],
        ...options,
      });

      const baseMaps = {
        OpenStreetMap: openStreetMap,
      };
      control.layers(baseMaps).addTo(map);

      if (center != null && zoom != null) {
        map.setView(center, zoom);
      } else if (bounds != null) {
        map.fitBounds(bounds, boundsOptions);
      }
      if (whenReady != null) {
        map.whenReady(whenReady);
      }

      control.zoom({ position: "bottomright" }).addTo(map);

      setContext(createLeafletContext(map));
    }
  }, []);

  useEffect(() => {
    return () => {
      context?.map.remove();
    };
  }, []);

  return (
    <div className={containerClassName} ref={mapContainerRef}>
      <div
        ref={mapRef}
        className={className ? className : `flex h-full w-full flex-1`}
      />
    </div>
  );
}
