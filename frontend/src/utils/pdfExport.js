// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export const exportToPDF = async (elementId, fileName = "cv.pdf") => {
//   const element = document.getElementById(elementId);
//   if (!element) return;

//   try {
//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       logging: false,
//       backgroundColor: "#ffffff",
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();
    
//     const imgWidth = canvas.width;
//     const imgHeight = canvas.height;
//     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
//     pdf.addImage(imgData, "PNG", 0, 0, imgWidth * ratio, imgHeight * ratio);
//     pdf.save(fileName);
//   } catch (error) {
//     console.error("Export error:", error);
//     alert("Có lỗi khi xuất PDF!");
//   }
// };

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportToPDF = async (elementId, fileName = "cv.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Lưu styles gốc
  const originalStyle = {
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
    width: element.style.width,
    maxWidth: element.style.maxWidth,
    transform: element.style.transform,
    boxShadow: element.style.boxShadow,
  };

  try {
    // Tạm thời đặt element về trạng thái full-width để render đúng
    element.style.position = "relative";
    element.style.left = "0";
    element.style.top = "0";
    element.style.width = "794px";
    element.style.maxWidth = "794px";
    element.style.transform = "none";
    element.style.boxShadow = "none";

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      // Chụp toàn bộ nội dung dù dài hơn viewport
      windowWidth: 794,
      scrollX: 0,
      scrollY: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // A4: 210mm x 297mm
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfWidth = 210;  // mm
    const pdfHeight = 297; // mm

    // Tính tỷ lệ: canvas pixels → mm
    // canvas.width = element.scrollWidth * scale (2)
    const pxPerMm = canvas.width / pdfWidth;
    const totalHeightMm = canvas.height / pxPerMm;

    if (totalHeightMm <= pdfHeight) {
      // CV vừa 1 trang
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, totalHeightMm);
    } else {
      // CV nhiều trang — cắt theo chiều cao trang A4
      let yOffset = 0; // mm đã xuất
      let pageIndex = 0;

      while (yOffset < totalHeightMm) {
        if (pageIndex > 0) pdf.addPage();

        const sliceHeightMm = Math.min(pdfHeight, totalHeightMm - yOffset);
        const sliceHeightPx = sliceHeightMm * pxPerMm;
        const yOffsetPx = yOffset * pxPerMm;

        // Tạo canvas nhỏ cho mỗi trang
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.ceil(sliceHeightPx);
        const ctx = pageCanvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0, Math.floor(yOffsetPx),       // src x, y
          canvas.width, Math.ceil(sliceHeightPx), // src w, h
          0, 0,                             // dst x, y
          pageCanvas.width, Math.ceil(sliceHeightPx)  // dst w, h
        );

        const pageImgData = pageCanvas.toDataURL("image/png");
        pdf.addImage(pageImgData, "PNG", 0, 0, pdfWidth, sliceHeightMm);

        yOffset += pdfHeight;
        pageIndex++;
      }
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("Export error:", error);
    alert("Có lỗi khi xuất PDF: " + error.message);
  } finally {
    // Khôi phục styles gốc
    Object.assign(element.style, originalStyle);
  }
};