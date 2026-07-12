export function getResponsiveScale(availableWidth, containerHeight, boxHeight) {
  // Escala base según ancho
  let baseScale;
  if (availableWidth < 360)
    baseScale = 18; // móviles muy estrechos
  else if (availableWidth < 576)
    baseScale = 16; // móviles (sm)
  else if (availableWidth < 768)
    baseScale = 14; // tablets (md)
  else if (availableWidth < 992)
    baseScale = 12; // laptops pequeñas
  else if (availableWidth < 1200)
    baseScale = 10; // desktop
  else baseScale = 9; // pantallas grandes

  // Ajustar por altura: si la caja es muy alta, reducir escala
  const maxHeightForScale = containerHeight * 0.7; // Usar 70% del contenedor disponible
  const estimatedHeightAtScale = boxHeight * baseScale * 1.5; // Factor de conversión isométrica

  if (estimatedHeightAtScale > maxHeightForScale) {
    const scaleFactor = maxHeightForScale / estimatedHeightAtScale;
    return Math.max(2, baseScale * scaleFactor); // Mínimo 2 para legibilidad
  }

  return baseScale;
}
