const lineElements = document.querySelectorAll('.line');
const lineArray = Array.from(lineElements);
const body = document.querySelector("body");

let lastScrollTop = 0;

document.addEventListener("DOMContentLoaded", () => {
    lineArray.forEach(line => {
        line.setAttribute("original-left", window.getComputedStyle(line).left);
        line.setAttribute("original-top", window.getComputedStyle(line).top)
    });

    console.log(lineArray)
});

document.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Scroll down
        for (let i = 0; i < lineArray.length; i++) {
            const line = lineArray[i];
            if (line.classList.contains("verticalLine")) {
                const computedStyle = window.getComputedStyle(line);
                if (parseFloat(computedStyle.left) > window.innerWidth * 0.5) { // if vertical line is on the right side of the screen  
                    line.style.left = "110vw"; // make it go right
                } else { // if its on the left side of the screen
                    line.style.left = "-10vw"; // make it go left
                }
            }

            if (line.classList.contains("horizontalLine")) {
                const computedStyle = window.getComputedStyle(line);
                if (parseFloat(computedStyle.top) > window.innerHeight * 0.7) { // if horizontal line is on the bottom side ISHHH of the screen
                    line.style.top = "210vh"; // make it go down
                } else { // if on top side of the screen
                    line.style.top = "-10vh"; // make it go up
                }
            }
        }
    } else {
        // reset to original position on scroll up
        for (let i = 0; i < lineArray.length; i++) {
            const line = lineArray[i];
            if (line.classList.contains("verticalLine")) {
                const originalLeft = line.getAttribute("original-left");
                line.style.left = originalLeft;
            }
            if (line.classList.contains("horizontalLine")) {
                const originalTop = line.getAttribute("original-top");
                line.style.top = originalTop;
            }
        }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // prevent negative values
});

for (let i = 0; i < lineArray.length; i++) {
    const line = lineArray[i];
    line.addEventListener("mouseover", () => {
        if (line.classList.contains("verticalLine")) { //vertical linesssss
            console.log("hovering vertical line");
            const hoverLine = document.createElement("div");
            hoverLine.classList.add("hoverLine");
            hoverLine.style.width = window.getComputedStyle(line).width;
            hoverLine.style.height = 210 + "vh";
            hoverLine.style.left = (parseFloat(window.getComputedStyle(line).left) + 10) + "px";

            // colors based on index
            if (i % 2 == 0) {
                hoverLine.style.backgroundColor = "#0039A6"; // blue A, C, E trains
            }
            else if (i % 3 == 0) {
                hoverLine.style.backgroundColor = "#fccc0a"; // yellow N, Q, R, W trains
            }
            else {
                hoverLine.style.backgroundColor = "#FF6319"; // orange B, D, F, M trains
            }
            body.appendChild(hoverLine);
        }

        if (line.classList.contains("horizontalLine")) { // horizontal linesss
            const hoverLine = document.createElement("div");
            hoverLine.classList.add("hoverLine");
            hoverLine.style.width = 100 + "vw";
            hoverLine.style.height = window.getComputedStyle(line).height;
            hoverLine.style.top = (parseFloat(window.getComputedStyle(line).top) + 10) + "px";

            if (i % 2 == 0) {
                hoverLine.style.backgroundColor = "#B933AD"; // purple 7 trains
            }
            else if (i % 3 == 0) {
                hoverLine.style.backgroundColor = "#6CBE45"; // green G trains
            }

            else {
                hoverLine.style.backgroundColor = "#FF6319"; // orange B, D, F, M trains
            }
            body.appendChild(hoverLine);
        }


    });
}