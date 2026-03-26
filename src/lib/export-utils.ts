export function downloadPNG(dataUrl: string, fileName = "design.png") {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

export async function downloadPDF(
  frontDataUrl: string,
  backDataUrl?: string,
  fileName = "design.pdf"
) {
  const { default: jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgWidth = pageWidth - 40;
  const imgHeight = (imgWidth * 3) / 4;
  const x = 20;

  pdf.setFontSize(16);
  pdf.text("Front View", x, 20);
  pdf.addImage(frontDataUrl, "PNG", x, 30, imgWidth, imgHeight);

  if (backDataUrl) {
    pdf.addPage();
    pdf.text("Back View", x, 20);
    pdf.addImage(backDataUrl, "PNG", x, 30, imgWidth, imgHeight);
  }

  pdf.save(fileName);
}
