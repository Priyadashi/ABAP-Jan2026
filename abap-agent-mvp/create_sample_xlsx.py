import openpyxl

# Create a sample RICEF specification Excel file
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Report Specification"

# Add some sample data
data = [
    ["Project Name", "Material Explorer PRO"],
    ["RICEF Type", "Report"],
    ["Description", "A simple report to list materials filtered by type."],
    [],
    ["Field Name", "Technical Name", "Description", "Data Element"],
    ["Material Number", "MATNR", "Material ID", "MATNR"],
    ["Material Type", "MTART", "Type of material", "MTART"],
    ["Created By", "ERNAM", "User who created the material", "ERNAM"],
    ["Creation Date", "ERSDA", "Date of creation", "ERSDA"]
]

for row in data:
    ws.append(row)

# Save the file
file_path = "sample_report_spec.xlsx"
wb.save(file_path)
print(f"File saved to {file_path}")
