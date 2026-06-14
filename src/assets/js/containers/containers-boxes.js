import { getVolumeTarget } from "../calcs";
import { createGrid, createBox } from "../../isometric-view/isometric-view";
import {
  IsometricCanvas,
  IsometricGroup,
  IsometricPath,
  IsometricRectangle,
  IsometricText,
} from '@elchininet/isometric'

let widthContainer, heightContainer, depthContainer, widthBox, heightBox, depthBox;
let resizeHandler = null;

function getResponsiveScale(availableWidth, containerHeight, boxHeight) {
    // Escala base según ancho
    let baseScale;
    if (availableWidth < 360)  baseScale = 18;   // móviles muy estrechos
    else if (availableWidth < 576)  baseScale = 16;   // móviles (sm)
    else if (availableWidth < 768)  baseScale = 14;   // tablets (md)
    else if (availableWidth < 992)  baseScale = 12;   // laptops pequeñas
    else if (availableWidth < 1200) baseScale = 10;   // desktop
    else baseScale = 9;                                 // pantallas grandes
    
    // Ajustar por altura: si la caja es muy alta, reducir escala
    const maxHeightForScale = containerHeight * 0.7; // Usar 70% del contenedor disponible
    const estimatedHeightAtScale = boxHeight * baseScale * 1.5; // Factor de conversión isométrica
    
    if (estimatedHeightAtScale > maxHeightForScale) {
        const scaleFactor = maxHeightForScale / estimatedHeightAtScale;
        return Math.max(2, baseScale * scaleFactor); // Mínimo 2 para legibilidad
    }
    
    return baseScale;
}

export function drawIsometric(){
    const divIsometric = document.getElementById('isometric-content-containers');
    divIsometric.innerHTML = '';
    if(resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
    }
    //Medir Anchura y Altura de Card
    const cardEl = divIsometric.closest('.card');
    const cardBody = divIsometric.closest('.card-body') ?? divIsometric;
    
    const measureEl = cardEl ?? divIsometric;
    const usableWidth = measureEl.clientWidth;
    const usableHeight = cardBody.clientHeight;

    const containerWidth = usableWidth > 0 ? usableWidth : 720;
    const containerHeight = usableHeight > 0 ? usableHeight : Math.round(containerWidth * (460 / 720));
    // Calcular Scale Responsivo según ancho Y altura de la caja
    const viewportWidth = window.innerWidth;
    const scale = getResponsiveScale(viewportWidth, containerHeight, heightBox);
    // Crear canvas con viewBox y medidas reales
    const canvas = new IsometricCanvas({
        container: divIsometric,
        width: containerWidth,
        height: containerHeight,
        backgroundColor: '#f8fafc',
        scale: scale,
    })

    const gridMargin = 3
    const grid_width = widthContainer + gridMargin * 2;
    const grid_depth = depthContainer + gridMargin* 2;

    //Primero se hace el Grid
    const grid = createGrid({
    width: grid_width,
    depth: grid_depth,
    })

    //Luego se hace el Suelo
    const floor = new IsometricRectangle({
    planeView: 'TOP',
    width: widthContainer,
    height: heightContainer,
    right: gridMargin,
    left: gridMargin,
    fillColor: '#dbeafe',
    strokeColor: '#94a3b8',
    })

    //Luego se hace la Caja
    const box = createBox({
    right: gridMargin,
    left: gridMargin,
    top: 0,
    width: widthBox,
    depth: depthBox,
    height: heightBox,
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

    //Definido y destruido al final en llamadas de drawIsometric para evitar problemas de redimensionamiento
    let resizeTimer = null;
    resizeHandler = () => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newWidth    = measureEl.clientWidth;
            const newHeight   = cardBody.clientHeight;
            const newViewport = window.innerWidth;
            const newScale = getResponsiveScale(newViewport, newHeight, heightBox);
            if (newWidth    !== containerWidth  ||
                newHeight   !== containerHeight ||
                newViewport !== viewportWidth ||
                newScale    !== scale) {
                drawIsometric();
            }
        }, 150);
    };
    window.addEventListener('resize', resizeHandler);
}

export function calcOrientationBoxes(){
    [widthContainer, heightContainer, depthContainer] = getVolumeTarget(0);
    [widthBox, heightBox, depthBox] = getVolumeTarget(1);

    const totales = Array.from({ length: 6 }, (_, i) => calcRotation(i));
    const mayor = Math.max(...totales);
    console.log(mayor);

    totales.forEach((total, i) => {
        document.getElementById(`box${i}`).innerHTML =
            total === mayor
                ? `<strong>${total}</strong>`
                : total;
    });
}

function calcRotation(rotation){
    let x, y, z;
    switch(Number(rotation)){
        case 0: x = depthBox; y = widthBox; z = heightBox; break;
        case 1: x = widthBox; y = depthBox; z = heightBox; break;
        case 2: x = heightBox; y = depthBox; z = widthBox; break;
        case 3: x = depthBox; y = heightBox; z = widthBox; break;
        case 4: x = widthBox; y = heightBox; z = depthBox; break;
        case 5: x = heightBox; y = widthBox; z = depthBox; break;
    }
    let n_depth = Math.floor(depthContainer/x);
    let n_width = Math.floor(widthContainer/y);
    let n_height = Math.floor(heightContainer/z);

    let total = n_depth*n_width*n_height;
    return total;
}
