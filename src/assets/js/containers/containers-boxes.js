import { getVolumeTarget } from "../calcs";

let widthContainer, heightContainer, depthContainer, widthBox, heightBox, depthBox;

export function calcOrientationBoxes(){
    [widthContainer, heightContainer, depthContainer] = getVolumeTarget(0);
    [widthBox, heightBox, depthBox] = getVolumeTarget(1);

    const totales = [calcRotation(0), calcRotation(1), calcRotation(2), calcRotation(3), calcRotation(4), calcRotation(5)];
    const mayor = Math.max(...totales);
    console.log(mayor);

    const box0 = document.getElementById("box0");
    const box1 = document.getElementById("box1");
    const box2 = document.getElementById("box2");
    const box3 = document.getElementById("box3");
    const box4 = document.getElementById("box4");
    const box5 = document.getElementById("box5");

    box0.innerHTML = (totales[0] === mayor) ? `<strong>${totales[0]}</strong>` : totales[0];
    box1.innerHTML = (totales[1] === mayor) ? `<strong>${totales[1]}</strong>` : totales[1];
    box2.innerHTML = (totales[2] === mayor) ? `<strong>${totales[2]}</strong>` : totales[2];
    box3.innerHTML = (totales[3] === mayor) ? `<strong>${totales[3]}</strong>` : totales[3];
    box4.innerHTML = (totales[4] === mayor) ? `<strong>${totales[4]}</strong>` : totales[4];
    box5.innerHTML = (totales[5] === mayor) ? `<strong>${totales[5]}</strong>` : totales[5];
}

function calcRotation(rotation){
    let x, y, z;
    switch(Number(rotation)){
        case 0:
            x = depthBox;
            y = widthBox;
            z = heightBox;
            break;
        case 1:
            x = widthBox;
            y = depthBox;
            z = heightBox;
            break;
        case 2:
            x = heightBox;
            y = depthBox;
            z = widthBox;
            break;
        case 3:
            x = depthBox;
            y = heightBox;
            z = widthBox;
            break;
        case 4:
            x = widthBox;
            y = heightBox;
            z = depthBox;
            break;
        case 5:
            x = heightBox;
            y = widthBox;
            z = depthBox;
            break;
    }
    let n_depth = Math.floor(depthContainer/x);
    let n_width = Math.floor(widthContainer/y);
    let n_height = Math.floor(heightContainer/z);

    let total = n_depth*n_width*n_height;
    return total;
}