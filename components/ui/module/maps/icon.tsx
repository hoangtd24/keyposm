import L from 'leaflet';

const IconMarker = L.icon({
    // options: {
    //     iconUrl: require(`${process.env}/marker-icon-2x.png`),
    //     // iconRetinaUrl: require('../img/marker-pin-person.svg'),
    //     // iconAnchor: null,
    //     // popupAnchor: null,
    //     // shadowUrl: null,
    //     // shadowSize: null,
    //     // shadowAnchor: null,
    //     iconSize: new L.Point(60, 75),
    //     className: 'leaflet-div-icon'
    // }
    iconUrl: 'marker-icon-2x.png',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -28]
});

export { IconMarker };