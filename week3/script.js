const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineWidth = 0.5;

const canvasOffset = canvas.getBoundingClientRect();
let offsetX = canvasOffset.left;
let offsetY = canvasOffset.top;

const dwarf = document.querySelector("#dwarf .dot");
const behemoth = document.querySelector("#behemoth .dot");
const tiny = document.querySelector("#tiny .dot");
const massive = document.querySelector("#massive .dot");
const compact = document.querySelector("#compact .dot");
const giant = document.querySelector("#giant .dot");
const minuscule = document.querySelector("#minuscule .dot");
const colossal = document.querySelector("#colossal .dot");
const speck = document.querySelector("#speck .dot");
const supermassive = document.querySelector("#supermassive .dot");
const micro = document.querySelector("#micro .dot");

const connectors = [
    { from: dwarf, to: tiny },
    { from: dwarf, to: compact },
    { from: dwarf, to: giant },
    { from: giant, to: massive },
    { from: tiny, to: compact },
    { from: compact, to: minuscule },
    { from: minuscule, to: speck },
    { from: speck, to: micro },
    { from: massive, to: supermassive },
    { from: supermassive, to: colossal },
    { from: colossal, to: behemoth }
];

let dragTarget = null;
let startX, startY;

let sizes = document.querySelectorAll(".size");
let names = document.querySelectorAll(".name");
let dots = document.querySelectorAll(".dot");
let body = document.body;

sizes.forEach(size => {
    size.addEventListener("mousedown", (e) => {
        dragTarget = size;
        startX = e.clientX - dragTarget.offsetLeft;
        startY = e.clientY - dragTarget.offsetTop;
        dragTarget.style.cursor = "grabbing";
    });

    size.addEventListener("dblclick", (e) => {
        console.log("Double clicked on size:", size.id);
        changeBackground(size.id);
    });
});

async function connect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 0.5;

    const dark = await isBackgroundDark();
    ctx.strokeStyle = dark ? 'white' : 'black';

    names.forEach(name => {
        name.style.color = dark ? 'white' : 'black';
    });

    dots.forEach(dot => {
        dot.style.backgroundColor = dark ? 'white' : 'black';
    });

    connectors.forEach(({ from, to }) => {
        const rect1 = from.getBoundingClientRect();
        const rect2 = to.getBoundingClientRect();

        ctx.beginPath();
        ctx.moveTo(rect1.left + rect1.width + 3 - offsetX, rect1.top + rect1.height / 2 - offsetY);
        ctx.lineTo(rect2.left + 5 - offsetX, rect2.top + rect2.height / 2 - offsetY);
        ctx.stroke();
    });
}

function isBackgroundDark() {
    // const bodyStyles = getComputedStyle(document.body);
    const bgImage = body.style.backgroundImage;

    if (!bgImage || bgImage === 'none') return false;

    const img = new Image();
    img.crossOrigin = 'anonymous'; // In case you're loading from NASA API or external URLs
    img.src = bgImage.slice(5, -2); // Strip url("...") to get the image URL

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    return new Promise((resolve) => {
        img.onload = () => {
            tempCanvas.width = window.innerWidth;
            tempCanvas.height = window.innerHeight;
            tempCtx.drawImage(img, 0, 0); // draw scaled down image to get average color
            const [r, g, b] = tempCtx.getImageData(0, 0, 1, 1).data;
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            resolve(brightness < 128); // threshold: <128 is "dark"
        };
        img.onerror = () => resolve(false); // fallback to light if error
    });
}


function changeBackground(sizeQuery) {
    const url = `https://images-api.nasa.gov/search?q=${sizeQuery}&media_type=image`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.collection.items.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.collection.items.length);
                const imageUrl = data.collection.items[randomIndex].links[0].href;
                document.body.style.backgroundImage = `url('${imageUrl}')`;

                connect();
            }
        })
        .catch(error => console.error("Error:", error));
}

document.addEventListener("mousemove", (e) => {
    if (dragTarget) {
        dragTarget.style.left = (e.clientX - startX) + "px";
        dragTarget.style.top = (e.clientY - startY) + "px";
        connect();
    }
});

document.addEventListener("mouseup", () => {
    if (dragTarget) {
        dragTarget.style.cursor = "grab";
        dragTarget = null;
    }
});

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const canvasOffset = canvas.getBoundingClientRect();
    offsetX = canvasOffset.left;
    offsetY = canvasOffset.top;

    connect();
});

connect();