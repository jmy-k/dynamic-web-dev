const lineElements = document.querySelectorAll('.line');
const lineArray = Array.from(lineElements);
const body = document.querySelector("body");

let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

document.addEventListener("DOMContentLoaded", () => {
    lineArray.forEach(line => {
        line.setAttribute("original-left", window.getComputedStyle(line).left);
        line.setAttribute("original-top", window.getComputedStyle(line).top);
        line.dataset.left = window.getComputedStyle(line).left; // store current left as it moves
        line.dataset.top = window.getComputedStyle(line).top; // store current top
    });
});

document.addEventListener("click", () => {
    let hoverLines = document.querySelectorAll(".hoverLine");
    hoverLines.forEach(line => {
        line.remove();
    });
})

document.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDelta = scrollTop - lastScrollTop; // diff in scroll position

    lineArray.forEach(line => {
        let currentLeft = parseFloat(line.dataset.left);
        let currentTop = parseFloat(line.dataset.top);
        let originalLeft = parseFloat(line.getAttribute("original-left"));
        let originalTop = parseFloat(line.getAttribute("original-top"));

        if (scrollDelta > 0) { // scroll down - move outward
            if (line.classList.contains("verticalLine")) {
                if (originalLeft > window.innerWidth * 0.5) { // right side - go right
                    line.dataset.left = `${currentLeft + scrollDelta * 0.5}px`;
                } else { // left side - go left
                    line.dataset.left = `${currentLeft - scrollDelta * 0.5}px`;
                }
            }

            if (line.classList.contains("horizontalLine")) {
                if (originalTop > window.innerHeight * 0.7) { // bottom side - go down
                    line.dataset.top = `${currentTop + scrollDelta * 0.5}px`;
                } else { // top side - go up
                    line.dataset.top = `${currentTop - scrollDelta * 0.5}px`;
                }
            }
        } else { // scroll up - revert to original position
            if (line.classList.contains("verticalLine")) {
                if (originalLeft > window.innerWidth * 0.5) { // right side
                    line.dataset.left = `${Math.max(originalLeft, currentLeft + scrollDelta * 0.5)}px`;
                } else { // left side - move left
                    line.dataset.left = `${Math.min(originalLeft, currentLeft - scrollDelta * 0.5)}px`;
                }
            }

            if (line.classList.contains("horizontalLine")) {
                if (originalTop > window.innerHeight * 0.7) { // bottom side
                    line.dataset.top = `${Math.max(originalTop, currentTop + scrollDelta * 0.5)}px`;
                } else { // top side
                    line.dataset.top = `${Math.min(originalTop, currentTop - scrollDelta * 0.5)}px`;
                }
            }
        }

        // updated positions
        line.style.left = line.dataset.left;
        line.style.top = line.dataset.top;
    });

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
            hoverLine.style.height = 240 + "vh";
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