export const hasForbiddenChars = (s: string) => /[/:*?"<>|,;]/.test(s);

export const isAllowedExt = (ext: string, allow: readonly string[]) => {
  const norm = (ext.startsWith('.') ? ext : `.${ext}`).toLowerCase();
  return allow.map((e) => e.toLowerCase()).includes(norm);
};
