export function getVolumeTarget(volumeTarget){
    const volumeTypes = [
        'Input',
        'InputContainer'  
    ];
    let width = document.getElementById(`width${volumeTypes[volumeTarget]}`).value;
    let height = document.getElementById(`height${volumeTypes[volumeTarget]}`).value;
    let depth = document.getElementById(`depth${volumeTypes[volumeTarget]}`).value;
    if(width == 0 || height == 0 || depth == 0){
        alert('No se ha introducido aún los lados o falta un lado con valor');
        if(volumeTarget === 1){
            volContainer.innerHTML = "No procesado...";
            volCaja.innerHTML = "No procesado...";
            volEficiencia.innerHTML = "No procesado...";
        }
        return;
    }
    if(width > 0 || height > 0 || depth > 0){
        const values = {
            width: Math.abs(width),
            height: Math.abs(height),
            depth: Math.abs(depth),
        };
        
        Object.entries(values).forEach(([key, value]) => {
            document.getElementById(`${key}${volumeTypes[volumeTarget]}`).value = value;
        });
    }

    return [width, height, depth];
}

export function formatNumber(num){
    return Number.isInteger(num) ? num : num.toFixed(1);
}