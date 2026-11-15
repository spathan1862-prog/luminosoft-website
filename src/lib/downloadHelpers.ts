/**
 * Direct Application Download Engine for Luminosoft
 * 
 * Guarantees a silent, instantaneous, cross-origin file download experience:
 * - Customer remains strictly on the same Luminosoft page
 * - No visible GitHub window or tab is opened
 * - No black screen or blank page flash
 * - No window.location.href navigation
 * - No page reloads or UI freezing
 * - Follows GitHub Release 302 redirects automatically in the background
 * - Supports large executables (.exe), Android packages (.apk), and archive files (.zip)
 *   without memory limits or CORS fetch blocks.
 */

export const DOWNLOAD_FRAME_ID = 'luminosoft-direct-download-frame';

/**
 * Retrieves or lazily creates a persistent hidden iframe in the document body.
 * The iframe acts as an isolated browsing context that absorbs HTTP 302 redirects
 * and forwards the final Content-Disposition: attachment header to the browser's
 * native download manager.
 */
export function getOrCreateDownloadFrame(): HTMLIFrameElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  let iframe = document.getElementById(DOWNLOAD_FRAME_ID) as HTMLIFrameElement | null;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = DOWNLOAD_FRAME_ID;
    iframe.name = DOWNLOAD_FRAME_ID;
    iframe.title = 'Luminosoft Direct Download Engine';
    iframe.setAttribute('aria-hidden', 'true');
    iframe.setAttribute('tabindex', '-1');
    iframe.style.position = 'fixed';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);
  }
  return iframe;
}

/**
 * Triggers an immediate direct file download for a target URL.
 * 
 * Primary Strategy:
 * Assigns the target URL to the hidden iframe. When GitHub responds with a 302 redirect
 * and Azure/AWS CDN returns 200 with Content-Disposition: attachment, the browser
 * native download manager immediately catches the file.
 * 
 * Fallback Strategy:
 * If iframe assignment fails, simulates an invisible anchor click targeting the
 * hidden browsing context to prevent main window navigation.
 */
export function triggerDirectDownload(url: string, filename?: string): boolean {
  if (!url || url === '#' || typeof window === 'undefined') {
    return false;
  }

  try {
    const frame = getOrCreateDownloadFrame();
    if (frame) {
      frame.src = url;
      return true;
    }
  } catch (err) {
    console.warn('Iframe download assignment failed, attempting anchor fallback:', err);
  }

  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = DOWNLOAD_FRAME_ID;
    if (filename) {
      link.download = filename;
    }
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 1000);
    return true;
  } catch (fallbackErr) {
    console.error('All direct download mechanisms failed:', fallbackErr);
    return false;
  }
}
