enum EncodingType {
    base64 = "base64"
}

export function decodedStr(encodedContent: string, encoding: string): string {
    if (encoding === EncodingType.base64) {
        return Buffer.from(encodedContent, encoding).toString("utf-8");
    } else {
        throw new Error(`Unsupported encoding type: ${encoding}`);
    }
}

export function valueOrFallback(value: string | null | undefined, fallback: string): string {
    return value !== null && value !== undefined ? value : fallback;
}  
