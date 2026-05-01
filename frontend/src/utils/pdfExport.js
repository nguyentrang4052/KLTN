/**
 * pdfExport.js — Xuất CV sang PDF: text đầy đủ, không bị cắt ngang, không trang trắng.
 *
 * Root cause text bị cắt (như trong ảnh):
 *   - html2canvas chụp trực tiếp element đang hiển thị trên UI
 *   - Element UI có overflow:hidden, width bị giới hạn bởi viewport/scroll container
 *   - contentEditable/input bị clip theo container
 *
 * Giải pháp: Clone → fix overflow → chụp clone → chia trang chính xác → xóa clone
 */

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const A4_W_MM = 210;
const A4_H_MM = 297;
const A4_W_PX = 794; // A4 tại 96dpi

export async function exportToPDF(elementId, filename = "CV.pdf") {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`[pdfExport] Element #${elementId} not found`);
    return;
  }

  // ── 1. Clone element ra ngoài viewport ─────────────────────────────────────
  const clone = element.cloneNode(true);

  Object.assign(clone.style, {
    position:      "fixed",
    top:           "0",
    left:          "-9999px",
    width:         `${A4_W_PX}px`,
    minWidth:      `${A4_W_PX}px`,
    maxWidth:      `${A4_W_PX}px`,
    height:        "auto",
    minHeight:     "auto",
    transform:     "none",
    zoom:          "1",
    overflow:      "visible",
    zIndex:        "-9999",
    pointerEvents: "none",
    boxSizing:     "border-box",
  });

  document.body.appendChild(clone);

  // ── 2. Fix tất cả element con: bỏ overflow hidden, thay input bằng div ─────
  clone.querySelectorAll("*").forEach((el) => {
    const cs = window.getComputedStyle(el);

    // Bỏ overflow hidden/auto/scroll — đây là nguyên nhân text bị cắt ngang
    if (["hidden", "auto", "scroll"].includes(cs.overflow))  el.style.overflow  = "visible";
    if (["hidden", "auto", "scroll"].includes(cs.overflowX)) el.style.overflowX = "visible";
    if (["hidden", "auto", "scroll"].includes(cs.overflowY)) el.style.overflowY = "visible";

    // Bỏ text-overflow ellipsis và white-space nowrap
    if (cs.textOverflow === "ellipsis") el.style.textOverflow = "clip";
    if (cs.whiteSpace === "nowrap")     el.style.whiteSpace   = "normal";

    // Bỏ max-width giới hạn (có thể gây wrap sai)
    if (cs.maxWidth && cs.maxWidth !== "none") el.style.maxWidth = "none";

    // Thay INPUT/TEXTAREA bằng div để hiển thị text đầy đủ
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      const div = document.createElement("div");
      div.textContent = el.value || el.getAttribute("value") || el.placeholder || "";
      Object.assign(div.style, {
        overflow:    "visible",
        whiteSpace:  "pre-wrap",
        wordBreak:   "break-word",
        border:      "none",
        outline:     "none",
        background:  "transparent",
        padding:     cs.padding,
        margin:      cs.margin,
        fontSize:    cs.fontSize,
        fontFamily:  cs.fontFamily,
        fontWeight:  cs.fontWeight,
        fontStyle:   cs.fontStyle,
        color:       cs.color,
        lineHeight:  cs.lineHeight,
        textAlign:   cs.textAlign,
        width:       "100%",
        boxSizing:   "border-box",
      });
      el.parentNode?.replaceChild(div, el);
      return; // el đã bị replace, dừng xử lý el này
    }

    // contentEditable: bỏ border/outline, giữ text
    if (el.isContentEditable) {
      Object.assign(el.style, {
        outline:    "none",
        border:     "none",
        overflow:   "visible",
        whiteSpace: "pre-wrap",
        wordBreak:  "break-word",
      });
    }
  });

  // ── 3. Đợi browser layout clone xong ───────────────────────────────────────
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  await new Promise((r) => setTimeout(r, 150));

  // Đo chiều cao thực sau khi bỏ overflow
  const cloneHeight = clone.scrollHeight || clone.offsetHeight;
  clone.style.height = `${cloneHeight}px`;

  // Đợi thêm 1 frame sau khi set height
  await new Promise((r) => requestAnimationFrame(r));

  try {
    // ── 4. Chụp clone với scale 3x để sắc nét ──────────────────────────────
    const SCALE = 3;
    const canvas = await html2canvas(clone, {
      scale:           SCALE,
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: "#ffffff",
      logging:         false,
      width:           A4_W_PX,
      height:          cloneHeight,
      windowWidth:     A4_W_PX,
      scrollX:         0,
      scrollY:         0,
      x:               0,
      y:               0,
    });

    // ── 5. Chia trang và xuất PDF ────────────────────────────────────────────
    // px trên canvas tương ứng với 1mm trong PDF
    const pxPerMm  = canvas.width / A4_W_MM;          // = (A4_W_PX * SCALE) / 210
    const pageH_px = Math.round(A4_H_MM * pxPerMm);   // chiều cao 1 trang A4 tính bằng px canvas
    const totalPages = Math.ceil(canvas.height / pageH_px);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit:        "mm",
      format:      "a4",
      compress:    true,
    });

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage();

      const srcY      = Math.round(page * pageH_px);
      const srcHeight = Math.min(pageH_px, canvas.height - srcY);

      // Canvas con cho trang này
      const pageCanvas    = document.createElement("canvas");
      pageCanvas.width    = canvas.width;
      pageCanvas.height   = srcHeight;

      const ctx = pageCanvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      ctx.drawImage(
        canvas,
        0, srcY, canvas.width, srcHeight,  // vùng source
        0, 0,    canvas.width, srcHeight   // vùng dest
      );

      const imgData         = pageCanvas.toDataURL("image/jpeg", 0.95);
      const renderedH_mm    = srcHeight / pxPerMm; // height chính xác, không dư → không trang trắng

      pdf.addImage(imgData, "JPEG", 0, 0, A4_W_MM, renderedH_mm, undefined, "FAST");
    }

    pdf.save(filename);

  } catch (err) {
    console.error("[pdfExport] Lỗi xuất PDF:", err);
  } finally {
    // ── 6. Dọn clone dù có lỗi ─────────────────────────────────────────────
    document.body.removeChild(clone);
  }
}