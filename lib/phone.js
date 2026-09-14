// پاکستانی فون نمبر ہمیشہ 0 سے شروع ہو
export function formatPhone(phone) {
  if (!phone) return null;
  let p = phone.toString().trim();
  // spaces ہٹائیں
  const digits = p.replace(/\D/g, "");
  if (!digits) return null;
  // +92xxxxxxxxxx یا 92xxxxxxxxxx → 0xxxxxxxxx
  if (digits.startsWith("92") && digits.length >= 11) {
    return "0" + digits.slice(2);
  }
  // پہلے سے 0 ہے
  if (digits.startsWith("0")) return digits;
  // باقی سب (3xx, 2x, 4x وغیرہ) → 0 لگا دو
  return "0" + digits;
}

export function waLink(phone) {
  if (!phone) return null;
  const p = formatPhone(phone);
  if (!p) return null;
  // 0 ہٹا کر 92 لگاؤ
  return `https://wa.me/92${p.slice(1)}`;
}
