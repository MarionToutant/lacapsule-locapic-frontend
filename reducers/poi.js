export default function(poi = [], action) {
    if(action.type === 'savePOI') {
        var poiCopy=[...poi];
        poiCopy.push({latitude: action.latitude, longitude: action.longitude, title: action.title, description: action.description})
        return poiCopy;
    } else if(action.type === 'deletePOI') {
        var poiCopy=[...poi];
        poiCopy.splice(action.position, 1)
        return poiCopy;
    } else {
        return poi;
    }
}