# Docs: Customization Guide
[[ Main README ]](../README.md)

## Styles for front-end
The main style file, found at `/public/css/main.css`. This file contains the definition for most of the mutabile colors in the front-end, and is made to be easy to access and modify. The structure for this defined as follows:
```css
:root {
    --datacolor1: #1D976C;
    --datacolor2:#93F9B9;
    --theme1: #444;
    --theme2: #888;
    --theme3: #bbb;
    --theme4: #ddd;
    --themeh: white;
    --themep: black;
}
```
### ***datacolor1* and *datacolor2***
These two colors define the notification glow for the **map view** and **graph view** buttons when new data as added for viewing.

### ***theme* colors**
Theme colors 1-4 define different UI colors to be used in the background of different elements. This is most visible in **data view**, but should theoretically make all three views follow the same color scheme, even though the other views are mostly covered by a map and a graph respectively.

### ***themeh* and *themep***
These two colors define default text colors for header size and paragraph size text respectively.

## Customizing the map
In `/public/js/map.js`, the following control variables can be found:
```javascript
maptype1 = "topo";
maptype2 = "satellite";
```
These can be used to modify the map modes shown in the **map view**. Possible values can be [found here](https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap) on the ArcGIS API website.