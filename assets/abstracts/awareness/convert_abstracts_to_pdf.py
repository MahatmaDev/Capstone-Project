from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib import colors
import os

# Folder where your abstracts are saved
BASE = os.getcwd()

FILES = {
    "abstract_english.txt": "abstract_english.pdf",
    "abstract_kiswahili.txt": "abstract_kiswahili.pdf",
    "abstract_kikuyu.txt": "abstract_kikuyu.pdf",
}

style = ParagraphStyle(
    name="Times15",
    fontName="Times-Roman",   # Times New Roman equivalent in PDF
    fontSize=12,
    leading=18,              # 1.5 line spacing (12*1.5 = 18)
    textColor=colors.black
)

for txt_name, pdf_name in FILES.items():
    txt_path = os.path.join(BASE, txt_name)
    pdf_path = os.path.join(BASE, pdf_name)

    if not os.path.exists(txt_path):
        print(f"NOT FOUND: {txt_name}  -> Skipping")
        continue

    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=72, rightMargin=72, topMargin=72, bottomMargin=72
    )

    elements = []

    with open(txt_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    for line in lines:
        clean = line.strip()
        if clean == "":
            elements.append(Spacer(1, 0.15 * inch))
        else:
            safe = clean.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            elements.append(Paragraph(safe, style))

    doc.build(elements)
    print(f"CREATED: {pdf_name}")

print("DONE ✅")