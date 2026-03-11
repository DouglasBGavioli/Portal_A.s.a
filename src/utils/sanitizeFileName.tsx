export function sanitizeFileName(name: string): string {
    return name
        .normalize("NFD") // remove acentos
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-") // espaços → hífen
        .replace(/[^a-zA-Z0-9.-]/g, "") // remove caracteres estranhos
        .toLowerCase();
}