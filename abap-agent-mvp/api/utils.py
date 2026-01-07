import openpyxl
import io
import json

def extract_text_from_xlsx(file_content: bytes) -> str:
    """
    Extract data from an Excel file and format as a Markdown table.
    Only processes the first sheet.
    """
    try:
        workbook = openpyxl.load_workbook(io.BytesIO(file_content), data_only=True)
        sheet = workbook.active
        
        rows = list(sheet.rows)
        if not rows:
            return "The Excel file is empty."
        
        markdown_table = []
        
        # Helper to clean cell value
        def clean_val(val):
            if val is None:
                return ""
            return str(val).replace("|", "\\|").replace("\n", " ").strip()

        # Process rows
        data_rows = []
        for row in rows:
            row_vals = [clean_val(cell.value) for cell in row]
            # Only include rows that have at least one non-empty cell
            if any(row_vals):
                data_rows.append(row_vals)
        
        if not data_rows:
            return "The Excel file contains no data."

        # Create header
        headers = data_rows[0]
        markdown_table.append("| " + " | ".join(headers) + " |")
        markdown_table.append("| " + " | ".join(["---"] * len(headers)) + " |")
        
        # Create data rows
        for row in data_rows[1:]:
            # Pad row if it has fewer columns than header
            if len(row) < len(headers):
                row.extend([""] * (len(headers) - len(row)))
            # Truncate if more
            row = row[:len(headers)]
            markdown_table.append("| " + " | ".join(row) + " |")
            
        return "\n".join(markdown_table)
    except Exception as e:
        return f"Error parsing Excel file: {str(e)}"

def extract_text_from_json(file_content: bytes) -> str:
    """Format JSON content neatly"""
    try:
        data = json.loads(file_content)
        return json.dumps(data, indent=2)
    except Exception:
        return file_content.decode('utf-8', errors='ignore')

def extract_text_from_txt(file_content: bytes) -> str:
    """Decode text file content"""
    return file_content.decode('utf-8', errors='ignore')

def get_file_content_as_text(file_content: bytes, filename: str) -> str:
    """Dispatcher for different file types"""
    ext = filename.split('.')[-1].lower()
    if ext == 'xlsx':
        return extract_text_from_xlsx(file_content)
    elif ext == 'json':
        return extract_text_from_json(file_content)
    elif ext == 'txt':
        return extract_text_from_txt(file_content)
    return ""
