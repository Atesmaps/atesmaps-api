// 1. Your locations array (I've imported the structure you provided)
const locationsData = [
    {}, // Index 0 is empty/placeholder
    { id: 1, name: "Andorra Centro", latitude: 42.53510694555712, longitude: 1.5529746979350716, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 2, name: "Andorra Norte", latitude: 42.58508140442987, longitude: 1.6121730217316999, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 3, name: "Andorra Sud", latitude: 42.47643586986891, longitude: 1.5254365477795353, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 4, name: "Aran", latitude: 42.72567723176232, longitude: 0.8281045165341556, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 5, name: "Cadi Moixeró", latitude: 42.310328696693205, longitude: 1.7425851209750538, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 6, name: "Franja Nord Pallaresa", latitude: 42.69102717939461, longitude: 1.1962633621105154, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 7, name: "Pallaresa", latitude: 42.52315563020173, longitude: 1.2052674661716754, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 8, name: "Perafita-Puigpedrós", latitude: 42.43414018231118, longitude: 1.7042078440086903, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 9, name: "Prepirineu", latitude: 42.2245394588584, longitude: 1.7061709869780184, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 10, name: "Ribagorçana-Vall fosca", latitude: 42.50068289698385, longitude: 0.8847895009997644, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 11, name: "Ter-Freser", latitude: 42.34214000793094, longitude: 2.206219368664737, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 12, name: "Gallego", latitude: 42.69828823872771, longitude: -0.32086395579789756, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 13, name: "Jacetania", latitude: 42.73616245506156, longitude: -0.6700259161023963, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 14, name: "Navarra", latitude: 42.89790515462238, longitude: -0.8838023992059396, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 15, name: "Ribagorza", latitude: 42.490199948537196, longitude: 0.5463579234317549, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 16, name: "Sobarbe", latitude: 42.589735813272995, longitude: 0.06135151529448856, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 17, name: "Aure-Louron", latitude: 42.81725925731871, longitude: 0.40036797174945615, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 18, name: "Aspe Ossau", latitude: 42.95054425358967, longitude: -0.4938979162532413, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 19, name: "Capcir Puymorens", latitude: 42.5745743526584, longitude: 2.0694767893058414, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 20, name: "Cerdagne Canigou", latitude: 42.47697846271217, longitude: 2.3300773692087, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 21, name: "Couserans", latitude: 42.840606256268444, longitude: 1.0914929689276556, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 22, name: "Haute-Ariege", latitude: 42.70727142469974, longitude: 1.6272922471171227, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 23, name: "Haute-Bigorre", latitude: 42.884428486335054, longitude: 0.0290562066956063, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 24, name: "Luchonnais", latitude: 42.79009890768029, longitude: 0.5678202122096825, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 25, name: "Orlu St.Barthelemy", latitude: 42.77647560690008, longitude: 1.8490136882170525, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
    { id: 26, name: "Pays Basques", latitude: 43.04467220887861, longitude: -0.9100899533724659, latitudeDelta: 0.7170, longitudeDelta: 0.7170 },
];

/**
 * Calculates the Haversine distance between two points in kilometers.
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in KM
 */
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/**
 * Finds the closest region index from the locationsData array.
 * @param {Object} inputLocation - GeoJSON object { type: 'Point', coordinates: [lon, lat] }
 * @returns {Object} The closest region object with its index.
 */
const getClosestRegion = (inputLocation) => {
    if (!inputLocation || !inputLocation.coordinates) {
        return null;
    }

    // GeoJSON format is [Longitude, Latitude]
    const inputLon = inputLocation.coordinates[0];
    const inputLat = inputLocation.coordinates[1];

    // 🔍 DEBUG LOGS: Verify what the server actually sees
    // console.log("--- LOCATION DEBUG ---");
    // console.log(`Server Received -> Lat: ${inputLat}, Lon: ${inputLon}`);

    const MAX_DISTANCE_KM = 100;

    let closestRegion = null;
    let minDistance = Infinity;
    let closestIndex = -1;

    // Iterate through locations, skipping empty objects
    locationsData.forEach((region, index) => {
        // Skip empty objects (like index 0 in your array)
        if (!region.latitude || !region.longitude) return;

        const dist = getDistanceFromLatLonInKm(
            inputLat, 
            inputLon, 
            region.latitude, 
            region.longitude
        );

        if (dist < minDistance) {
            minDistance = dist;
            closestRegion = region;
            closestIndex = index;
        }
    });

    // console.log(`Winner: ${closestRegion?.name} at ${minDistance.toFixed(2)} km`);
    // console.log("----------------------");

    if (minDistance > MAX_DISTANCE_KM) {
        return null; // No valid region found nearby
    }

    return {
        index: closestIndex,
        region: closestRegion,
        distanceKm: minDistance
    };
};

module.exports = {
    locationsData,
    getClosestRegion
};