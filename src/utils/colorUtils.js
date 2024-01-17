export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
}
export function expandHexColor(color) {
    // Adiciona "#" se não estiver presente
    if (color[0] !== '#') {
        color = '#' + color;
    }

    // Verifica se é uma cor hex válida
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!regex.test(color)) {
        throw new Error("cor hex inválida");
    }

    // Se a cor for do tipo curto (3 dígitos), expanda para 6 dígitos
    if (color.length === 4) {
        color = color.split('').map(char => char === '#' ? char : char + char).join('');
    }

    return color;
}