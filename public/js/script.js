    const socket = io();

    console.log("mdakdnasn");
    

    if(navigator.geolocation){
        navigator.geolocation.watchPosition((position) => {
           const { latitude , longitude} = position.coords;
           socket.emit("send-location", {latitude,longitude}); 
        },(error)=>{
          console.error(error);  
        },
        {
            enableHighAccuracy:true,
            timeout:5000,
            maximumAge:0,
        }
    
    );
    }else{
        console.warn("Geolocation is not supported by this browser");
    }
    
   const map = L.map("map").setView([0,0],10);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);


const markers = {};
// list for location updates from the server
socket.on("receive-location",(data)=>{
    const {id, latitude, longitude} = data;
    console.log(`Received location for ${id}: [${latitude}, ${longitude}]`);
    map.setView([latitude, longitude],16);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }

})
