import re
import json

with open(r'C:\Users\tomas\.gemini\antigravity\brain\ad441375-af0a-42d4-87d7-ad1d7899b997\master_brand_discovery_form.md', 'r', encoding='utf-8') as f:
    text = f.read()

sections = re.split(r'\n## \d+\. ', text)
sections = sections[1:-1] # exclude header and 'NOTAS FINALES' etc

form_data = []

for idx, s in enumerate(sections):
    lines = s.strip().split('\n')
    title = lines[0].strip()
    
    section_obj = {
        'id': f'section_{idx+1}',
        'title': f'{idx+1}. {title}',
        'questions': []
    }
    
    current_q = None
    
    for line in lines[1:]:
        line = line.strip()
        if not line: continue
        
        q_match = re.match(r'^\*\*?\d+\.\d+\.\s*(.*?)\*\*?$', line)
        if q_match:
            q_text = q_match.group(1).strip()
            q_type = 'textarea'
            
            current_q = {
                'id': f"q_{idx+1}_{len(section_obj['questions'])+1}",
                'text': q_text,
                'type': q_type,
                'options': []
            }
            section_obj['questions'].append(current_q)
        elif line.startswith('☐') or line.startswith('○') or line.startswith('[ ]'):
            if current_q:
                current_q['type'] = 'checkbox' if '☐' in line or '[ ]' in line else 'radio'
                opt_text = re.sub(r'^[☐○\[\]\s]+', '', line)
                current_q['options'].append(opt_text)
                
    if not section_obj['questions']:
        section_obj['questions'].append({
            'id': f'q_{idx+1}_1',
            'text': 'Escribe aquí tu respuesta para esta sección',
            'type': 'textarea',
            'options': []
        })
        
    form_data.append(section_obj)

form_data.append({
    'id': 'section_36',
    'title': '36. EJERCICIOS CREATIVOS FINALES',
    'questions': [
        {'id': 'q_36_1', 'text': 'Si tu marca fuera un animal, sería: (y por qué)', 'type': 'textarea'},
        {'id': 'q_36_2', 'text': 'Si tu marca fuera una ciudad del mundo, sería: (y por qué)', 'type': 'textarea'},
        {'id': 'q_36_3', 'text': 'Si tu marca fuera una película, sería: (y por qué)', 'type': 'textarea'}
    ]
})

with open(r'C:\Users\tomas\.gemini\antigravity\scratch\brand-form\src\formData.json', 'w', encoding='utf-8') as f:
    json.dump(form_data, f, ensure_ascii=False, indent=2)

print('formData.json generated successfully.')
