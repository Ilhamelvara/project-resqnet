export interface MappedErrors {
  general?: string;
  fields: Record<string, string>;
}

export const mapBackendError = (data: any): MappedErrors => {
  const { error, code, details } = data || {};
  const result: MappedErrors = { fields: {} };

  if (code === 'VALIDATION_ERROR' && Array.isArray(details)) {
    details.forEach((det: any) => {
      if (det.field && det.message) {
        result.fields[det.field] = det.message;
      }
    });
    result.general = error || 'Terdapat kesalahan pengisian data.';
    return result;
  }

  switch (code) {
    case 'EMAIL_EXISTS':
      result.fields.email = 'Email ini sudah terdaftar. Gunakan email lain.';
      break;
    case 'INVALID_CREDENTIALS':
      result.general = 'Email atau password salah.';
      break;
    case 'USER_NOT_FOUND':
      result.fields.email = 'Pengguna tidak ditemukan.';
      break;
    case 'FORBIDDEN':
      result.general = 'Anda tidak memiliki akses untuk melakukan tindakan ini.';
      break;
    case 'NOT_FOUND':
      result.general = 'Data tidak ditemukan.';
      break;
    case 'INVALID_TOKEN':
      result.general = 'Sesi anda telah berakhir. Silakan masuk kembali.';
      break;
    default:
      const msg = error || 'Terjadi kesalahan pada server.';
      const lowerError = msg.toLowerCase();
      if (lowerError.includes('email')) {
        result.fields.email = msg;
      } else if (lowerError.includes('password')) {
        result.fields.password = msg;
      } else if (lowerError.includes('name') || lowerError.includes('nama')) {
        result.fields.name = msg;
      } else {
        result.general = msg;
      }
  }

  return result;
};
