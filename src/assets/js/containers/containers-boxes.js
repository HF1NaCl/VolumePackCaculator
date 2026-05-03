import { getVolumeTarget } from "../calcs";
import isometricContainerHTML from '../../isometric-view/isometric-containers.html?raw';
import { createGrid, createBox } from "../../isometric-view/isometric-view";
import {
  IsometricCanvas,
  IsometricGroup,
  IsometricPath,
  IsometricRectangle,
  IsometricText,
} from '@elchininet/isometric'

let widthContainer, heightContainer, depthContainer, widthBox, heightBox, depthBox;

export function getIsometricViewBoxes(){
    const div = document.getElementById("cubeSize");
    const newIsometricView = document.createElement('div');
    newIsometricView.innerHTML = isometricContainerHTML;
    div.append(newIsometricView);
    
    //Una vez renderizado, empezamos a generar el contenido.
    drawIsometric();
}

function drawIsometric(){
    const divIsometric = document.getElementById('isometric-content-containers');
    //Antes de definir los Elementos, se hace el Div tipo svg
    const canvas = new IsometricCanvas({
    container: divIsometric,
    width: 720,
    height: 460,
    backgroundColor: '#f8fafc',
    scale: 10,
    })

    //Primero se hace el Grid
    const grid = createGrid({
    width: 18,
    depth: 14,
    })

    //Luego se hace el Suelo
    const floor = new IsometricRectangle({
    planeView: 'TOP',
    width: 12,
    height: 10,
    right: 3,
    left: 3,
    fillColor: '#dbeafe',
    strokeColor: '#94a3b8',
    })

    //Luego se hace la Caja
    const box = createBox({
    right: 100,
    left: 100,
    top: 100,
    width: 13,
    depth: 12,
    height: 12,
    colors: {
        top: '#fef3c7',
        front: '#f59e0b',
        side: '#d97706',
        stroke: '#78350f',
    },
    })

    //Se hace el Label correspondiente
    const label = new IsometricText({
    content: 'Caja',
    planeView: 'TOP',
    right: 6.8,
    left: 5.4,
    top: 2.2,
    fontSize: '14px',
    fillColor: '#0f172a',
    })

    //Finalmente se define el Scene
    const scene = new IsometricGroup({
    top: 4,
    })
    
    scene.addChildren(grid, floor, box, label)
    canvas.addChild(scene);
}

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