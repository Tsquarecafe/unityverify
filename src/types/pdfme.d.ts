export type Font = {
    [fontName: string]: {
      data: Uint8Array | ArrayBuffer;
      fallback?: boolean;
      subset?: boolean;
    };
  };