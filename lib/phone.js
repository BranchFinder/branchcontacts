export function formatPhone(phone) {
  if (!phone) return null;
  const raw = phone.toString().trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  if (raw.startsWith("+92") || (digits.startsWith("92") && digits.length === 12)) {
    return "0" + digits.slice(2);
  }
  if (digits.startsWith("0")) return digits;
  if (digits.startsWith("111") && digits.length === 9) return digits;
  if (digits.length === 10 && digits.startsWith("3")) return "0" + digits;
  if (digits.length >= 8 && digits.length <= 10) return "0" + digits;
  return digits;
}

export function waLink(phone) {
  if (!phone) return null;
  const p = formatPhone(phone);
  if (!p) return null;
  const digits = p.replace(/\D/g, "");
  if (digits.startsWith("0")) return `https://wa.me/92${digits.slice(1)}`;
  return `https://wa.me/92${digits}`;
}
