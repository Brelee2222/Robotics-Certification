const vehiclesElement = document.querySelector("div#vehicleStops.stops");
document.querySelector(".titleHeader").on = () => console.log("ww");
var vehicles = [];
const busLine = document.createElement("div");

//https://developer.trimet.org/
//  
//https://developer.trimet.org/ws_docs/vehicle_locations_ws.shtml\
function init() {
    //busInfo.appendChild(document.createElement("p")).id = "..." is better, but less clean
    busLine.className = "busLineContainer";
    const busInfo = busLine.appendChild(document.createElement("section"));
    busInfo.id = "busInfo";
    const busHeader = busInfo.appendChild(document.createElement("p"));
    busHeader.innerText = "Bus Line";
    busHeader.id = "busHeader";
    const busNumber = busInfo.appendChild(document.createElement("p"));
    busNumber.id = "busNumber";
    const busName = busInfo.appendChild(document.createElement("p"));
    busName.id = "busName";
    const arrivalInfo = busLine.appendChild(document.createElement("aside"));
    arrivalInfo.id = "arrivalInfo";
    const arrivalHeader = arrivalInfo.appendChild(document.createElement("p"));
    arrivalHeader.innerText = "arrival times";
    arrivalHeader.id = "arrivalHeader";
    const arrivalTimes = arrivalInfo.appendChild(document.createElement("p"));
    arrivalTimes.id = "arrivalTime";
}

async function fetchTrimetData() {
    return (await fetch("https://developer.trimet.org/ws/v2/vehicles/hasTripId/true&appId=B393B2CE96A258A72BAB481CA")).json();
}

async function getTrimetArrivals(locIds) {
    console.log(locIds);
    return (await fetch(`https://developer.trimet.org/ws/v2/arrivals/?locIDs=${locIds}&appId=B393B2CE96A258A72BAB481CA`)).json();
}

function updateBusLines(data) {
    vehicles = data.resultSet.vehicle;
    let locIds = [];
    for(let vehicle of vehicles)
        (locIds[vehicle.nextLocID] == undefined ? locIds[vehicle.nextLocID] = [] : locIds[vehicle.nextLocID]).push(vehicle.tripID);
    let locIdList = "";
    for(let locId in locIds)
        if(locIds[locId])
            locIdList += `,${locId}`;
    let arrivals = getTrimetArrivals(locIdList.slice(1)).then(arrival => updateLocations(arrival, locIds));
    
    // vehicles -> locIds -> locations with incoming vehicles
    //https://developer.trimet.org/ws/v2/arrivals?locIDs=8342&appId=B393B2CE96A258A72BAB481CA
}

function updateLocations(arrivals, locs) {
    console.log(arrivals);
    let locations = {};
    for(let location of arrivals.resultSet.location)
        locations[location.id] = location;
    for(let arrival of arrivals.resultSet.arrival) {
        if(!locations[arrival.locid])
            continue;
        let time = arrival[arrival.status] - arrivals.resultSet.queryTime;
        if(time <= 0)
            continue;
        console.log(busLine.querySelector("#busNumber").innerText = arrival.locid);
        console.log(busLine.querySelector("#busName").innerText = locations[arrival.locid].desc);
        busLine.querySelector("#arrivalTime").innerText = ((time)/6000).toFixed() + "m";
        vehiclesElement.appendChild(busLine.cloneNode(true));
    }
}

function updateTrimetData() {
    fetchTrimetData().then(updateBusLines);
}
init();
updateTrimetData();