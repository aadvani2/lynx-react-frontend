/**
 * Lazy-loaded SweetAlert2 helper
 * Dynamically imports sweetalert2 only when needed to reduce initial bundle size
 */

import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

let swalModule: typeof import('sweetalert2') | null = null;

/**
 * Get SweetAlert2 instance, loading it dynamically if not already loaded
 */
export async function getSwal() {
  if (!swalModule) {
    swalModule = await import('sweetalert2');
  }
  return swalModule.default;
}

/**
 * Convenience wrapper for Swal.fire() with lazy loading
 * Accepts the same options as Swal.fire()
 */
export async function swalFire(options: SweetAlertOptions): Promise<SweetAlertResult> {
  const Swal = await getSwal();
  return Swal.fire(options);
}
