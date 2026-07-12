const inputSuffixes = ['Input', 'InputContainer'];
const dimensionNames = ['width', 'height', 'depth'];

export function getVolumeTarget(target) {
  const suffix = inputSuffixes[target];

  if (!suffix) return null;

  const values = dimensionNames.map((name) => {
    const input = document.getElementById(`${name}${suffix}`);
    return Math.abs(Number(input.value));
  });

  if (!values.every((value) => Number.isFinite(value) && value > 0)) {
    alert('Ingresa valores mayores a cero para todas las dimensiones.');
    return null;
  }

  dimensionNames.forEach((name, index) => {
    document.getElementById(`${name}${suffix}`).value = values[index];
  });

  return values;
}

export function formatNumber(number) {
  return Number.isInteger(number) ? number : number.toFixed(1);
}
