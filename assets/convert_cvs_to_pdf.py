from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import A4
import os

base_path = r"D:\Capstone\assets\documents"

files = {
    "CV_English.txt": "CV_English.pdf",
    "CV_Kiswahili.txt": "CV_Kiswahili.pdf",
    "CV_Kikuyu.txt": "CV_Kikuyu.pdf"
}

custom_style = ParagraphStyle(
    name='CustomStyle',
    fontName='Times-Roman',
    fontSize=12,
    leading=18,  # 1.5 line spacing
    textColor=colors.black,
)

for txt_file, pdf_file in files.items():
    txt_path = os.path.join(base_path, txt_file)
    pdf_path = os.path.join(base_path, pdf_file)

    if not os.path.exists(txt_path):
        print(f"{txt_file} not found. Skipping.")
        continue

    doc = SimpleDocTemplate(pdf_path, pagesize=A4)
    elements = []

    with open(txt_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    for line in lines:
        clean = line.strip()
        if clean == "":
            elements.append(Spacer(1, 0.2 * inch))
        else:
            elements.append(Paragraph(clean.replace("&", "&amp;"), custom_style))
            elements.append(Spacer(1, 0.1 * inch))

    doc.build(elements)
    print(f"Created: {pdf_file}")

print("All done.")