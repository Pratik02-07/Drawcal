import google.generativeai as genai
import json
import re
from PIL import Image
import io
from constants import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

def clean_json_string(s):
    print("Original response:", s)
    
    # If the response is empty or None, return a default response
    if not s:
        return '[{"expr": "No response", "result": "Please try again", "assign": false}]'
    
    # First, try to extract content from markdown code blocks if present
    code_block_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', s)
    if code_block_match:
        s = code_block_match.group(1)
    
    # Remove any remaining markdown formatting
    s = re.sub(r'```\w*', '', s)
    
    # Remove any leading/trailing whitespace
    s = s.strip()
    
    # If the string is empty after cleaning, return a default response
    if not s:
        return '[{"expr": "Empty response", "result": "Please try again", "assign": false}]'
    
    # If the string doesn't start with [ or {, wrap it in []
    if not s.startswith('[') and not s.startswith('{'):
        s = f'[{s}]'
    
    # Replace single quotes with double quotes for JSON compatibility
    s = re.sub(r"'([^']*)'", r'"\1"', s)
    
    # Ensure all keys are quoted
    s = re.sub(r'(\w+):', r'"\1":', s)
    
    # Remove any Python-specific syntax
    s = s.replace('True', 'true')
    s = s.replace('False', 'false')
    s = s.replace('None', 'null')
    
    # Remove any newlines and extra spaces while preserving decimal points
    s = re.sub(r'\s+', ' ', s)
    
    # Remove any remaining non-JSON text while preserving mathematical operators and decimal points
    s = re.sub(r'[^\[\]\{\}\"\'\w\s:,+\-*/=().]', '', s)
    
    print("Cleaned string:", s)
    return s

def format_result(result_str: str) -> str:
    """Format the result string to ensure proper decimal point handling."""
    try:
        # If it's not a number, return as is
        num = float(result_str)
        
        # If it's already a decimal number, preserve its format but ensure minimum decimal places
        if '.' in result_str:
            decimal_places = len(result_str.split('.')[1])
            # For division or complex calculations, allow up to 6 decimal places
            if '/' in result_str or any(op in result_str for op in ['*', '×', '÷']):
                return f"{num:.6f}".rstrip('0').rstrip('.') if decimal_places < 6 else result_str
            # For other calculations, ensure at least 3 decimal places
            if decimal_places < 3:
                return f"{num:.3f}"
            return result_str
            
        # For division results and other calculations that result in decimals
        if num != int(num):
            # Use 6 decimal places for division results
            if '/' in result_str:
                return f"{num:.6f}"
            # Use 3 decimal places for other decimal results
            return f"{num:.3f}"
            
        # For whole numbers, return without decimal places
        return str(int(num))
        
    except ValueError:
        return result_str

def analyze_image(img: Image, dict_of_vars: dict):
    dict_of_vars_str = json.dumps(dict_of_vars, ensure_ascii=False)
    
    # Create a structured prompt with clear instructions
    prompt = [
        "You are a mathematical expression analyzer that handles all types of calculations including decimal and non-decimal numbers. Your task is to analyze the provided image and return a JSON response.",
        "Rules:",
        "1. Return ONLY a JSON array containing one or more objects",
        "2. Each object must have these exact keys: 'expr', 'result', 'assign'",
        "3. Use double quotes for all keys and string values",
        "4. Number Handling Rules:",
        "   - For decimal numbers:",
        "     * PRESERVE ALL DECIMAL POINTS exactly as shown in the image",
        "     * DO NOT merge digits across decimal points",
        "     * Example: '44.55' is forty-four point fifty-five, NOT four-thousand four-hundred fifty-five",
        "     * Example: '3.14' is three point fourteen, NOT three-hundred fourteen",
        "   - For whole numbers:",
        "     * Handle them as exact integers",
        "     * Example: '42' remains as '42' (no decimal places)",
        "5. For mathematical expressions:",
        "   - Handle both decimal and non-decimal numbers appropriately",
        "   - Treat decimal points as mathematical decimal separators",
        "   - Calculate with full precision",
        "   - Example: '44.55 + 55.33' = '99.880'",
        "   - Example: '42 + 58' = '100' (no decimal places for whole numbers)",
        "6. For results:",
        "   - For decimal results:",
        "     * Always show at least 3 decimal places",
        "     * Use up to 6 decimal places for division",
        "     * Never remove significant decimal places",
        "   - For whole number results:",
        "     * Show without decimal places (e.g., '42' instead of '42.000')",
        "7. For variable assignments (like x = 5), set assign to true",
        "8. Available variables: " + dict_of_vars_str,
        "",
        "Correct Examples:",
        '[{"expr": "44.55 + 55.33", "result": "99.880", "assign": false}]',
        '[{"expr": "42 + 58", "result": "100", "assign": false}]',
        '[{"expr": "3.14159", "result": "3.142", "assign": false}]',
        '[{"expr": "10.0 / 3.0", "result": "3.333333", "assign": false}]',
        '[{"expr": "x = 5", "result": "5", "assign": true}]',
        "",
        "Incorrect Examples (DO NOT DO THIS):",
        '❌ {"expr": "44.55", "result": "4455"}  // WRONG - preserves decimal point',
        '❌ {"expr": "3.14", "result": "314"}    // WRONG - preserves decimal point',
        '❌ {"expr": "42", "result": "42.000"}   // WRONG - whole numbers should not have decimal places',
        "",
        "Now analyze the image, being careful to handle both decimal and non-decimal numbers appropriately, and return your response in the exact format shown above."
    ]
    
    try:
        # Convert PIL Image to bytes
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        
        # Create the content parts with emphasis on decimal handling
        content_parts = [
            {
                "text": "\n".join(prompt)
            },
            {
                "inline_data": {
                    "mime_type": "image/png",
                    "data": img_byte_arr
                }
            }
        ]
        
        # Generate content with structured prompt
        response = model.generate_content(content_parts)
        print("Raw response from Gemini:", response.text) # CHANGE
        
        if not response.text:
            print("Empty response received from Gemini") # CHANGE 
            return [{"expr": "Empty response", "result": "Please try again", "assign": False}]
        
        try:
            # Clean the response text while preserving decimal points
            cleaned_text = clean_json_string(response.text)
            print("Cleaned response text:", cleaned_text)
            
            # Try to parse the JSON
            try:
                answers = json.loads(cleaned_text)
                print("Successfully parsed JSON:", answers)
            except json.JSONDecodeError as e:
                print(f"Failed to parse JSON: {e}")
                # Try to extract a valid JSON array from the response
                match = re.search(r'\[.*\]', cleaned_text)
                if match:
                    cleaned_text = match.group(0)
                    print("Extracted JSON array:", cleaned_text)
                    answers = json.loads(cleaned_text)
                else:
                    # Return a default response if we can't parse the JSON
                    return [{"expr": "Invalid response format", "result": "Please try again", "assign": False}]
            
            # Ensure we have a list
            if not isinstance(answers, list):
                answers = [answers]
            
            # Process each answer with careful decimal handling
            processed_answers = []
            for answer in answers:
                if not isinstance(answer, dict):
                    continue
                
                # Get the expression and result
                expr = str(answer.get('expr', ''))
                result = str(answer.get('result', ''))
                
                # Ensure the expression preserves decimal points
                if '.' not in expr and any(c.isdigit() for c in expr):
                    # Check if the original expression in the image had decimal points
                    # This is a safeguard in case the model drops them
                    print("Warning: Expression is missing decimal points that might have been in the image")
                
                processed_answer = {
                    'expr': expr,
                    'result': format_result(result),
                    'assign': bool(answer.get('assign', False))
                }
                processed_answers.append(processed_answer)
            
            if not processed_answers:
                return [{"expr": "No valid results found", "result": "Please try again", "assign": False}]
                
            return processed_answers
            
        except json.JSONDecodeError as e:
            print(f"Error in parsing JSON response: {e}")
            print("Raw response that failed to parse:", response.text)
            return [{"expr": "Error parsing response", "result": str(e), "assign": False}]
        except Exception as e:
            print(f"Unexpected error in parsing response: {e}")
            print("Raw response that failed to parse:", response.text)
            return [{"expr": "Error parsing response", "result": str(e), "assign": False}]
        
    except Exception as e:
        print(f"Error in Gemini API call: {e}")
        return [{"expr": "Error in API call", "result": str(e), "assign": False}]