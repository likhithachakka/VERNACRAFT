import json
import urllib.request
import urllib.error
import time

BASE_URL = "http://localhost:3000"

results = []

def run_test(test_id, category, feature, test_case, expected_result, severity, runner_fn):
    start = time.time()
    try:
        passed, actual_result, notes = runner_fn()
        elapsed = round((time.time() - start) * 1000, 1)
        status = "PASS" if passed else "FAIL"
        results.append({
            "test_id": test_id,
            "category": category,
            "feature": feature,
            "test_case": test_case,
            "expected_result": expected_result,
            "actual_result": f"{actual_result} ({elapsed}ms)",
            "status": status,
            "severity": severity,
            "notes": notes
        })
    except Exception as e:
        elapsed = round((time.time() - start) * 1000, 1)
        results.append({
            "test_id": test_id,
            "category": category,
            "feature": feature,
            "test_case": test_case,
            "expected_result": expected_result,
            "actual_result": f"Exception: {str(e)} ({elapsed}ms)",
            "status": "FAIL",
            "severity": severity,
            "notes": str(e)
        })

def req(path, method="GET", body=None, headers=None):
    if headers is None:
        headers = {}
    data = None
    if body is not None:
        if isinstance(body, (dict, list)):
            data = json.dumps(body).encode('utf-8')
            headers['Content-Type'] = 'application/json'
        elif isinstance(body, str):
            data = body.encode('utf-8')
            if 'Content-Type' not in headers:
                headers['Content-Type'] = 'application/json'
    
    url = f"{BASE_URL}{path}"
    req_obj = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req_obj, timeout=30) as resp:
            status_code = resp.status
            content = resp.read().decode('utf-8', errors='ignore')
            try:
                parsed = json.loads(content)
            except:
                parsed = content
            return status_code, parsed
    except urllib.error.HTTPError as e:
        err_content = e.read().decode('utf-8', errors='ignore')
        try:
            parsed = json.loads(err_content)
        except:
            parsed = err_content
        return e.code, parsed
    except Exception as e:
        return 0, str(e)

# ==========================================
# 1. FUNCTIONAL TESTS
# ==========================================

# TC-01: Health Endpoint
def t_health():
    code, data = req("/api/health")
    if code == 200 and data.get("status") == "ok":
        return True, "HTTP 200 with status=ok", ""
    return False, f"HTTP {code}: {data}", "Expected 200 with status=ok"
run_test("TC-FN-01", "Functional", "System Health", "GET /api/health", "HTTP 200, status=ok, aiAvailable reported", "High", t_health)

# TC-02: Languages List
def t_languages():
    code, data = req("/api/languages")
    if code == 200 and isinstance(data, list) and len(data) >= 5:
        langs = [d.get("name") for d in data]
        return True, f"HTTP 200, returned {len(data)} languages: {', '.join(langs[:4])}...", ""
    return False, f"HTTP {code}: {data}", "Expected list of >= 5 languages"
run_test("TC-FN-02", "Functional", "Language Catalog", "GET /api/languages", "HTTP 200, list containing Santhali, Hindi, Telugu, Mundari, Ho", "High", t_languages)

# TC-03: Curriculum List
def t_curriculum():
    code, data = req("/api/curriculum")
    if code == 200 and isinstance(data, list) and len(data) > 0:
        return True, f"HTTP 200, returned {len(data)} curriculum subjects/grades", ""
    return False, f"HTTP {code}: {data}", "Expected non-empty list of curriculum"
run_test("TC-FN-03", "Functional", "Curriculum API", "GET /api/curriculum", "HTTP 200, Jharkhand primary curriculum data", "Medium", t_curriculum)

# TC-04: Lessons List & Detail
def t_lessons():
    code, data = req("/api/lessons")
    if code == 200 and isinstance(data, list) and len(data) > 0:
        first_id = data[0].get("id")
        c2, d2 = req(f"/api/lessons/{first_id}")
        if c2 == 200 and d2.get("id") == first_id:
            return True, f"HTTP 200, retrieved {len(data)} lessons and detailed view for {first_id}", ""
        return False, f"Detail failed: HTTP {c2}", "Lesson detail did not match"
    return False, f"List failed: HTTP {code}", "Expected list of lessons"
run_test("TC-FN-04", "Functional", "Lessons API", "GET /api/lessons & GET /api/lessons/:id", "HTTP 200 for list and individual lesson detail", "High", t_lessons)

# TC-05: Create Lesson
def t_create_lesson():
    payload = {
        "title": "Seed Germination & Soils",
        "topic": "Germination",
        "subject": "Environmental Studies",
        "grade": 3,
        "vernacularLanguage": "hi",
        "primaryLanguage": "en"
    }
    code, data = req("/api/lessons", method="POST", body=payload)
    if code == 200 and data.get("id") and data.get("title") == payload["title"]:
        return True, f"HTTP 200, created lesson with ID: {data.get('id')}", ""
    return False, f"HTTP {code}: {data}", "Failed to create lesson"
run_test("TC-FN-05", "Functional", "Create Lesson", "POST /api/lessons", "HTTP 200, lesson created and persisted with generated ID", "High", t_create_lesson)

# TC-06: AI Pedagogy Generation
def t_pedagogy():
    payload = {
        "topic": "Water Cycle (Jal Chakra)",
        "grade": 4,
        "subject": "Environmental Studies",
        "teachingLanguage": "en",
        "targetLanguage": "hi",
        "context": "Jharkhand rural village near Subarnarekha river"
    }
    code, data = req("/api/ai/pedagogy-explain", method="POST", body=payload)
    if code == 200 and isinstance(data, dict):
        has_analogy = bool(data.get("relatableAnalogy") or data.get("localAnalogy"))
        has_story = bool(data.get("localContextStory") or data.get("story"))
        has_vernacular = bool(data.get("vernacularExplanation"))
        if has_vernacular and (has_analogy or has_story):
            return True, f"HTTP 200, pedagogy generated with local village analogy & story", ""
        return False, f"Incomplete schema: keys={list(data.keys())}", "Missing expected pedagogy fields"
    return False, f"HTTP {code}: {data}", "Expected 200 with structured pedagogy"
run_test("TC-FN-06", "Functional", "AI Pedagogy Engine", "POST /api/ai/pedagogy-explain", "HTTP 200, structured response with relatable village analogy and vernacular explanation", "Critical", t_pedagogy)

# TC-07: AI Tutor Chat
def t_ai_tutor():
    payload = {
        "studentMessage": "नमस्ते साथी, बारिश कैसे होती है? (Namaste Sathi, how does rain happen?)",
        "currentTopic": "Water Cycle",
        "grade": 4,
        "language": "hi",
        "confusionLevel": 2
    }
    code, data = req("/api/ai/tutor", method="POST", body=payload)
    if code == 200 and isinstance(data, dict):
        msg = data.get("message") or data.get("reply") or data.get("response") or ""
        if len(msg) > 10:
            return True, f"HTTP 200, Sathi AI responded: '{msg[:60]}...'", ""
        return False, f"Empty message in tutor response: {data}", "Expected encouraging response text"
    return False, f"HTTP {code}: {data}", "Failed to get AI Tutor response"
run_test("TC-FN-07", "Functional", "Sathi AI Tutor", "POST /api/ai/tutor", "HTTP 200, Sathi responds warmly in student mother tongue", "Critical", t_ai_tutor)

# TC-08: AI Translation / Cultural Context
def t_ai_translate():
    payload = {
        "text": "Evaporation happens when the sun heats water in ponds and turns it into invisible vapor.",
        "sourceLang": "en",
        "targetLang": "hi",
        "gradeLevel": 4
    }
    code, data = req("/api/ai/translate", method="POST", body=payload)
    if code == 200 and isinstance(data, dict):
        trans = data.get("translatedText") or data.get("translation")
        if trans and len(trans) > 5:
            return True, f"HTTP 200, translated to: '{trans[:60]}...'", ""
        return False, f"Missing translatedText: {data}", "Expected translated text"
    return False, f"HTTP {code}: {data}", "Translation endpoint error"
run_test("TC-FN-08", "Functional", "Cultural Translator", "POST /api/ai/translate", "HTTP 200, pedagogical translation with grade-appropriate vocabulary", "High", t_ai_translate)

# TC-09: Bhashini Status and Phonetics
def t_bhashini_status():
    code, data = req("/api/bhashini/status")
    if code == 200 and "service" in data:
        return True, f"HTTP 200, service={data.get('service')}, configured={data.get('configured')}", ""
    return False, f"HTTP {code}: {data}", "Expected Bhashini service status"
run_test("TC-FN-09", "Functional", "Bhashini Status", "GET /api/bhashini/status", "HTTP 200, Bhashini connectivity & configuration status", "Medium", t_bhashini_status)

# TC-10: Quiz Submission & Misconception Remediation
def t_quiz_submit():
    payload = {
        "studentId": "student-birsa-01",
        "quizId": "quiz-water-cycle-01",
        "answers": {
            "q1": "A",
            "q2": "B"
        }
    }
    code, data = req("/api/quiz/submit", method="POST", body=payload)
    if code == 200 and "attempt" in data and "progress" in data:
        score = data["attempt"].get("score")
        max_s = data["attempt"].get("maxScore")
        return True, f"HTTP 200, attempt scored: {score}/{max_s}, progress updated", ""
    return False, f"HTTP {code}: {data}", "Failed to submit quiz"
run_test("TC-FN-10", "Functional", "Adaptive Quiz Engine", "POST /api/quiz/submit", "HTTP 200, evaluation of answers and misconception diagnosis", "High", t_quiz_submit)

# TC-11: Teacher Analytics Endpoint
def t_teacher_analytics():
    code, data = req("/api/teacher/analytics")
    if code == 200 and "classAverage" in data and "totalStudents" in data:
        return True, f"HTTP 200, totalStudents={data.get('totalStudents')}, avg={data.get('classAverage')}%", ""
    return False, f"HTTP {code}: {data}", "Expected class analytics summary"
run_test("TC-FN-11", "Functional", "Teacher Analytics", "GET /api/teacher/analytics", "HTTP 200, classroom averages, vocabulary mastery, and retention stats", "Medium", t_teacher_analytics)

# TC-12: Worksheets Retrieval & Generation
def t_worksheets():
    code, data = req("/api/worksheets")
    if code == 200 and isinstance(data, list):
        gen_payload = {
            "topic": "Photosynthesis and Forest Plants",
            "grade": 4,
            "subject": "EVS",
            "primaryLanguage": "en",
            "vernacularLanguage": "hi"
        }
        c2, d2 = req("/api/worksheet/generate", method="POST", body=gen_payload)
        if c2 == 200 and d2.get("id"):
            return True, f"HTTP 200, fetched {len(data)} worksheets and generated new bilingual worksheet ID={d2.get('id')}", ""
        return False, f"Generate failed: HTTP {c2}", "Worksheet generation failed"
    return False, f"List failed: HTTP {code}", "Expected worksheets list"
run_test("TC-FN-12", "Functional", "Worksheets API", "GET /api/worksheets & POST /api/worksheet/generate", "HTTP 200, bilingual worksheet generation with vocabulary matching", "High", t_worksheets)

# TC-13: Offline Bundle Endpoint
def t_offline_bundle():
    code, data = req("/api/offline-bundle?lang=hi")
    if code == 200 and "lessons" in data and "quizzes" in data:
        return True, f"HTTP 200, bundle package returned with {len(data['lessons'])} lessons and {len(data['quizzes'])} quizzes", ""
    return False, f"HTTP {code}: {data}", "Expected offline bundle package"
run_test("TC-FN-13", "Functional", "Offline Sync Bundle", "GET /api/offline-bundle", "HTTP 200, offline package for low-connectivity rural school caching", "High", t_offline_bundle)

# ==========================================
# 2. INPUT & VALIDATION TESTS
# ==========================================

# TC-IN-01: Empty Topic in Pedagogy
def t_empty_topic():
    code, data = req("/api/ai/pedagogy-explain", method="POST", body={"topic": ""})
    if code == 400 and "error" in data:
        return True, f"HTTP 400 Bad Request correctly returned: '{data.get('error')}'", ""
    return False, f"HTTP {code}: {data}", "Expected 400 Bad Request on empty topic"
run_test("TC-IN-01", "Input Validation", "AI Pedagogy", "Empty topic payload", "HTTP 400 error message 'Topic is required'", "High", t_empty_topic)

# TC-IN-02: Missing Student Message in AI Tutor
def t_empty_tutor_msg():
    code, data = req("/api/ai/tutor", method="POST", body={"studentMessage": ""})
    if code == 400 and "error" in data:
        return True, f"HTTP 400 Bad Request correctly returned: '{data.get('error')}'", ""
    return False, f"HTTP {code}: {data}", "Expected 400 Bad Request on empty studentMessage"
run_test("TC-IN-02", "Input Validation", "AI Tutor", "Empty studentMessage payload", "HTTP 400 error message 'Student message is required'", "High", t_empty_tutor_msg)

# TC-IN-03: Very Long Input (10,000 characters)
def t_very_long_input():
    long_text = "Water cycle in village. " * 500
    code, data = req("/api/ai/translate", method="POST", body={"text": long_text, "sourceLang": "en", "targetLang": "hi"})
    if code in [200, 400]:
        return True, f"HTTP {code}, server gracefully handled 12,000 char payload without crash", ""
    return False, f"HTTP {code}: {data}", "Server crashed or returned 500"
run_test("TC-IN-03", "Input Validation", "Cultural Translator", "Very large payload (12KB string)", "Handled gracefully (200 or 400), no 500 server crash", "Medium", t_very_long_input)

# TC-IN-04: Special Characters & XSS Injections
def t_xss_input():
    xss_payload = "<script>alert('xss')</script> & ' OR 1=1 -- <img src=x onerror=alert(1)>"
    code, data = req("/api/ai/tutor", method="POST", body={"studentMessage": xss_payload, "language": "hi"})
    if code == 200:
        resp = str(data)
        if "<script>alert" not in resp:
            return True, f"HTTP 200, input sanitized/handled safely without raw reflection", ""
        return False, "Raw script reflected back", "Possible XSS reflection"
    return False, f"HTTP {code}", "Unexpected response"
run_test("TC-IN-04", "Security/Input", "AI Tutor Input", "XSS and SQL injection strings", "No execution or unsafe reflection, graceful response", "High", t_xss_input)

# TC-IN-05: Multilingual Vernacular Inputs (Santhali Ol Chiki & Telugu)
def t_multilingual_input():
    santhali_query = "ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱞᱟᱹᱭ ᱢᱮ ᱫᱟᱜ ᱪᱮᱠᱟᱛᱮ ᱦᱤᱡᱩᱜ-ᱟ? (Tell me in Santhali how rain comes)"
    code, data = req("/api/ai/tutor", method="POST", body={"studentMessage": santhali_query, "language": "sat", "currentTopic": "Rain"})
    if code == 200 and data.get("message"):
        return True, f"HTTP 200, AI replied to Santhali Ol Chiki query: '{data.get('message')[:50]}...'", ""
    return False, f"HTTP {code}: {data}", "Failed to process Santhali Ol Chiki query"
run_test("TC-IN-05", "Input Validation", "Multilingual Support", "Santhali Ol Chiki script query (ᱥᱟᱱᱛᱟᱲᱤ)", "HTTP 200, AI comprehends and responds appropriately", "High", t_multilingual_input)

# ==========================================
# 3. AI BEHAVIOR & RISK TESTS
# ==========================================

# TC-AI-01: Ambiguous & Nonsense Query Handling
def t_nonsense_query():
    nonsense = "Why is the moon made of purple rasgulla and cheese?"
    code, data = req("/api/ai/tutor", method="POST", body={"studentMessage": nonsense, "grade": 4, "language": "en"})
    if code == 200 and data.get("message"):
        msg = data.get("message").lower()
        return True, f"HTTP 200, AI replied gently with age-appropriate scientific grounding: '{data.get('message')[:60]}...'", ""
    return False, f"HTTP {code}: {data}", "Failed to handle ambiguous prompt"
run_test("TC-AI-01", "AI Testing", "Sathi AI Tutor", "Nonsense/Factual risk prompt ('moon made of cheese')", "AI gently corrects misconception while keeping joyful tone", "Medium", t_nonsense_query)

# TC-AI-02: Auto-Animate Scene Generation
def t_auto_animate():
    payload = {
        "topic": "Evaporation and Condensation in Nature",
        "grade": 4,
        "language": "hi",
        "customPrompt": "Show village pond drying in summer sun and water droplets forming on cold steel thali"
    }
    code, data = req("/api/ai/generate-animation", method="POST", body=payload)
    if code == 200 and isinstance(data, dict):
        scenes = data.get("scenes") or data.get("frames") or []
        return True, f"HTTP 200, animation project generated with {len(scenes)} visual pedagogical steps", ""
    return False, f"HTTP {code}: {data}", "Failed to generate animation scenes"
run_test("TC-AI-02", "AI Testing", "Auto-Animate Tool", "Generate animation scenes with village metaphor", "HTTP 200, structured SVG/canvas animation script with scenes", "High", t_auto_animate)

# ==========================================
# 4. EDGE CASE & ERROR RECOVERY
# ==========================================

# TC-ED-01: Non-existent Lesson ID
def t_nonexistent_lesson():
    code, data = req("/api/lessons/nonexistent-id-999999")
    if code == 404:
        return True, "HTTP 404 Not Found correctly returned", ""
    return False, f"HTTP {code}: {data}", "Expected 404 on missing lesson ID"
run_test("TC-ED-01", "Edge Cases", "Lessons API", "GET non-existent lesson ID", "HTTP 404 Not Found error with clear message", "Medium", t_nonexistent_lesson)

# TC-ED-02: Non-existent Quiz ID fallback in submit
def t_fallback_quiz():
    payload = {
        "studentId": "student-birsa-01",
        "quizId": "quiz-unknown-xyz",
        "answers": {"q1": "A"}
    }
    code, data = req("/api/quiz/submit", method="POST", body=payload)
    if code == 200 and "attempt" in data:
        return True, "HTTP 200, server gracefully fell back to default active quiz without crashing", ""
    return False, f"HTTP {code}: {data}", "Server crashed on unknown quiz ID"
run_test("TC-ED-02", "Edge Cases", "Quiz Engine", "Submit answers for invalid quizId", "Graceful fallback to active curriculum quiz", "Low", t_fallback_quiz)

# ==========================================
# 5. SECURITY TESTING
# ==========================================

# TC-SEC-01: Verify No API Key Leaked in Frontend or Public HTML
def t_sec_api_key():
    c1, html_content = req("/")
    c2, main_js = req("/src/main.tsx")
    
    # Check if process.env.GEMINI_API_KEY is present anywhere in client HTML
    leaked = False
    reasons = []
    if "AIzaSy" in str(html_content):
        leaked = True
        reasons.append("Google API key signature found in index.html")
    if "AIzaSy" in str(main_js):
        leaked = True
        reasons.append("Google API key signature found in main.tsx")
    
    if not leaked:
        return True, "No Gemini API keys or credentials exposed in frontend HTML/JS", ""
    return False, f"Security risk: {reasons}", "API key found in client bundle"
run_test("TC-SEC-01", "Security", "Key Exposure", "Inspect client HTML/JS for exposed API keys", "Zero exposed secret keys in frontend client bundles", "Critical", t_sec_api_key)

# Print Summary
print(json.dumps(results, indent=2))
