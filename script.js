const button = document.querySelector("#textThing");
button.onclick = function() {
    alert("hilo wurld");
    let text = button.appendChild(document.createElement("a"));
    button.style.color = "#000000";
    button.className = "why"
    getData().then(res => res.json().then(json => button.innerText = `I have a server named ${json.name}`));
}
async function getData(){
    return (await fetch("https://discord.com/api/guilds/807113739119755264/widget.json"));
}