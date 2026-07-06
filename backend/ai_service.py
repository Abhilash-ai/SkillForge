import os
import google.generativeai as genai
import json

# Fetch API key from environment
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# We use gemini-3.5-flash as the standard available model with high rate limits
model = genai.GenerativeModel('gemini-3.5-flash')

def generate_career_roadmap(career: str, education_level: str, time_commitment: str) -> dict:
    """
    Calls Gemini API to generate a personalized career roadmap in JSON format.
    """
    if not api_key:
        # Fallback dummy data if no key is present during dev
        return {
            "career": career,
            "description": f"A roadmap to become a {career}",
            "milestones": [
                {"title": "Fundamentals", "duration": "2 weeks", "tasks": ["Learn Basics", "Understand Concepts"]}
            ]
        }

    prompt = f"""
    You are an expert AI Career Coach and Technical Mentor. Generate a highly detailed and practical learning roadmap for becoming a {career}.
    The user's current education level is {education_level} and they can commit to studying {time_commitment}.
    Create exactly 4 to 6 comprehensive milestones. Each milestone must have 3-5 specific, actionable tasks, and 1 capstone project.
    Return the response EXCLUSIVELY as a valid JSON object with the following structure:
    {{
        "career": "{career}",
        "description": "Brief, motivating description of this career path.",
        "estimated_months": 6,
        "milestones": [
            {{
                "title": "Milestone name (e.g., Advanced System Design)",
                "duration": "e.g., 4 weeks",
                "description": "What they will learn in this milestone",
                "tasks": ["Specific actionable task 1", "Specific actionable task 2", "Specific actionable task 3"],
                "projects": ["A concrete capstone project suggestion to solidify these skills"]
            }}
        ]
    }}
    Ensure the JSON is perfectly formatted and does not contain markdown backticks (like ```json).
    """

    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        text = response.text.strip()
        import re
        # Find the first { and last } to robustly extract just the JSON object
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            text = text[start_idx:end_idx+1]
        
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error generating roadmap: {e}")
        return {"error": f"Failed to generate roadmap: {str(e)}"}

def get_career_insights(career: str) -> dict:
    """
    Calls Gemini API to get insights about a specific career path.
    """
    if not api_key:
        return {
            "career": career,
            "salary_range": "$70k - $150k",
            "demand": "High",
            "key_skills": ["Skill 1", "Skill 2"]
        }
        
    prompt = f"""
    Provide career insights for a {career}.
    Return EXCLUSIVELY as a valid JSON object:
    {{
        "career": "{career}",
        "overview": "Brief overview",
        "salary_range": "e.g. $80k - $160k",
        "demand": "e.g. Very High",
        "key_skills": ["Skill 1", "Skill 2", "Skill 3"],
        "top_companies": ["Company 1", "Company 2"]
    }}
    Ensure no markdown backticks.
    """
    
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error generating insights: {e}")
        return {"error": f"Failed to get insights: {str(e)}"}

def chat_with_mentor(message: str, history: list) -> str:
    """
    Simple single-turn chat with history injected into prompt.
    """
    if not api_key:
        return f"AI Mentor (Mock): You said '{message}'"
        
    history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])
    
    prompt = f"""
    You are an expert AI Career Mentor for SkillForge.
    You help students and professionals with coding, careers, interview prep, and roadmaps.
    Be encouraging, concise, and highly informative.
    
    Conversation History:
    {history_text}
    
    User: {message}
    Mentor:
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error with mentor chat: {e}")
        return "I'm having trouble thinking right now. Please try again later."

def analyze_resume(resume_text: str, job_description: str) -> dict:
    """
    Analyzes a resume against a job description using Gemini.
    """
    if not api_key:
        return {
            "ats_score": 85,
            "missing_keywords": ["Python", "FastAPI", "React"],
            "suggestions": ["Add more metrics to your impact statements.", "Include a link to your GitHub."],
            "weak_areas": ["Backend architecture experience is light."]
        }
    
    prompt = f"""
    You are an expert Technical Recruiter and ATS system.
    Evaluate the following resume against the provided job description.
    
    Job Description:
    {job_description if job_description else 'Generic Software Engineering Role'}
    
    Resume Text:
    {resume_text}
    
    Return EXCLUSIVELY a valid JSON object with:
    {{
        "ats_score": 85,
        "missing_keywords": ["List", "of", "missing", "skills"],
        "suggestions": ["Actionable improvement 1", "Actionable improvement 2"],
        "weak_areas": ["Weakness 1", "Weakness 2"]
    }}
    Ensure no markdown backticks.
    """
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error analyzing resume: {e}")
        return {"error": "Failed to analyze resume."}

def generate_assessment_questions(topic: str) -> dict:
    """
    Returns assessment questions. Uses pre-generated banks for core topics for speed,
    falls back to Gemini for custom topics.
    """
    
    # Pre-generated question banks for core categories to ensure instant loading
    core_banks = {
        "Frontend Development": [
            {"question": "What is the primary purpose of the Virtual DOM in React?", "options": ["To directly manipulate the browser's DOM faster", "To keep a lightweight copy of the DOM to compute minimal updates", "To replace HTML with a virtual language", "To compile CSS into JavaScript"], "correct": 1},
            {"question": "Which CSS property is used to control the space between flex items?", "options": ["margin", "padding", "gap", "spacing"], "correct": 2},
            {"question": "What does a Promise represent in JavaScript?", "options": ["A guaranteed synchronous execution", "The eventual completion or failure of an asynchronous operation", "A strict type definition for a variable", "A loop that runs indefinitely"], "correct": 1},
            {"question": "Which HTTP method is typically used to update an entire resource?", "options": ["GET", "POST", "PUT", "PATCH"], "correct": 2},
            {"question": "What is the primary purpose of a Web Worker?", "options": ["To style elements asynchronously", "To run scripts in background threads", "To handle database connections", "To cache assets for offline use"], "correct": 1},
            {"question": "Which attribute is used to provide alternative text for an image?", "options": ["title", "alt", "src", "href"], "correct": 1},
            {"question": "What does CORS stand for?", "options": ["Cross-Origin Resource Sharing", "Centralized Object Rendering System", "Cascading Order Routing Style", "Control Of React States"], "correct": 0},
            {"question": "In React, what hook is used to perform side effects?", "options": ["useState", "useContext", "useEffect", "useReducer"], "correct": 2},
            {"question": "Which of the following is NOT a JavaScript framework/library?", "options": ["Vue", "Angular", "Django", "Svelte"], "correct": 2},
            {"question": "What is the purpose of the <meta name='viewport'> tag?", "options": ["To define the page title", "To control layout on mobile browsers", "To link external stylesheets", "To set the character encoding"], "correct": 1},
        ],
        "Backend Development": [
            {"question": "What is the primary role of a Reverse Proxy?", "options": ["To store database records", "To sit in front of web servers and forward client requests", "To render HTML on the client", "To compile backend code"], "correct": 1},
            {"question": "Which of the following is a characteristic of REST APIs?", "options": ["They maintain client state on the server", "They are stateless", "They only use the POST method", "They require XML"], "correct": 1},
            {"question": "What does ORM stand for?", "options": ["Object-Relational Mapping", "Online Resource Management", "Operational Request Method", "Object Rendering Module"], "correct": 0},
            {"question": "In Node.js, what is the event loop?", "options": ["A framework for building UIs", "The mechanism that handles asynchronous callbacks", "A database querying language", "A tool for minifying code"], "correct": 1},
            {"question": "What is the purpose of JWT (JSON Web Tokens)?", "options": ["To format HTTP responses", "To securely transmit information between parties", "To style web pages", "To store data in a SQL database"], "correct": 1},
            {"question": "Which HTTP status code indicates 'Not Found'?", "options": ["200", "400", "404", "500"], "correct": 2},
            {"question": "What is an API Gateway?", "options": ["A tool for frontend state management", "A single entry point for routing requests to microservices", "A type of NoSQL database", "A CSS preprocessor"], "correct": 1},
            {"question": "Which of these is a popular Python web framework?", "options": ["Express", "Spring Boot", "FastAPI", "Laravel"], "correct": 2},
            {"question": "What does ACID stand for in database systems?", "options": ["Atomicity, Consistency, Isolation, Durability", "Active, Concurrent, Independent, Dynamic", "Automated, Cached, Indexed, Distributed", "Asynchronous, Callable, Integrated, Documented"], "correct": 0},
            {"question": "What is the purpose of connection pooling?", "options": ["To share user sessions", "To reuse database connections to improve performance", "To combine multiple APIs into one", "To load balance traffic"], "correct": 1},
        ],
        "DevOps & Cloud": [
            {"question": "What is the primary function of Docker?", "options": ["To host websites", "To package applications and dependencies into containers", "To write backend logic", "To manage databases"], "correct": 1},
            {"question": "Which tool is commonly used for container orchestration?", "options": ["Jenkins", "Kubernetes", "Ansible", "Git"], "correct": 1},
            {"question": "What does CI/CD stand for?", "options": ["Continuous Integration / Continuous Deployment", "Cloud Infrastructure / Cloud Data", "Centralized Integration / Centralized Distribution", "Code Inspection / Code Delivery"], "correct": 0},
            {"question": "What is Infrastructure as Code (IaC)?", "options": ["Writing applications in assembly", "Managing infrastructure using configuration files", "A database design pattern", "A cloud provider billing model"], "correct": 1},
            {"question": "Which of the following is an AWS serverless compute service?", "options": ["EC2", "S3", "Lambda", "RDS"], "correct": 2},
            {"question": "What is a load balancer?", "options": ["A tool that compiles code", "A device that distributes network traffic across multiple servers", "A type of firewall", "A database backup mechanism"], "correct": 1},
            {"question": "What does scaling 'horizontally' mean?", "options": ["Adding more RAM to a server", "Adding more servers to a pool", "Upgrading the CPU", "Switching to a faster hard drive"], "correct": 1},
            {"question": "Which tool is primarily used for configuration management?", "options": ["Docker", "Terraform", "Ansible", "Prometheus"], "correct": 2},
            {"question": "What is the purpose of Prometheus in a DevOps stack?", "options": ["Monitoring and alerting", "Source code management", "Container runtime", "Database administration"], "correct": 0},
            {"question": "What is a Blue-Green deployment?", "options": ["A deployment strategy that minimizes downtime by running two identical environments", "A method for encrypting data", "A tool for managing secrets", "A cloud pricing model"], "correct": 0},
        ],
        "Data Structures & Algorithms": [
            {"question": "What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?", "options": ["O(1)", "O(log n)", "O(n)", "O(n^2)"], "correct": 1},
            {"question": "Which data structure operates on a Last In, First Out (LIFO) principle?", "options": ["Queue", "Stack", "Linked List", "Tree"], "correct": 1},
            {"question": "What is the worst-case time complexity of QuickSort?", "options": ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"], "correct": 2},
            {"question": "Which algorithm is used to find the shortest path in a weighted graph?", "options": ["Depth First Search", "Breadth First Search", "Dijkstra's Algorithm", "Merge Sort"], "correct": 2},
            {"question": "What is a Hash Table used for?", "options": ["Sorting data", "Storing key-value pairs for fast retrieval", "Traversing trees", "Reversing strings"], "correct": 1},
            {"question": "In a min-heap, where is the smallest element located?", "options": ["At the root", "At the leftmost leaf", "At the rightmost leaf", "In the middle"], "correct": 0},
            {"question": "Which data structure is best for implementing a priority queue?", "options": ["Array", "Linked List", "Heap", "Stack"], "correct": 2},
            {"question": "What is the time complexity of accessing an element in an array by index?", "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"], "correct": 0},
            {"question": "Which algorithmic paradigm does the Fibonacci sequence calculation often use to optimize performance?", "options": ["Greedy", "Divide and Conquer", "Dynamic Programming", "Backtracking"], "correct": 2},
            {"question": "What is the main advantage of a Linked List over an Array?", "options": ["Faster random access", "Dynamic size and ease of insertion/deletion", "Less memory usage", "Better cache locality"], "correct": 1},
        ],
        "Databases": [
            {"question": "Which language is used to query relational databases?", "options": ["Python", "Java", "SQL", "NoSQL"], "correct": 2},
            {"question": "What is a Primary Key?", "options": ["A key used to encrypt the database", "A unique identifier for a record in a table", "A column that links to another table", "A password for the database admin"], "correct": 1},
            {"question": "What does a JOIN operation do?", "options": ["Deletes records from a table", "Combines rows from two or more tables based on a related column", "Updates existing records", "Creates a new database"], "correct": 1},
            {"question": "Which of the following is a NoSQL database?", "options": ["PostgreSQL", "MySQL", "MongoDB", "Oracle"], "correct": 2},
            {"question": "What is database normalization?", "options": ["The process of converting data to strings", "The process of organizing data to minimize redundancy", "The process of backing up a database", "The process of indexing all columns"], "correct": 1},
            {"question": "What is an index in a database?", "options": ["A separate table for logs", "A data structure that improves the speed of data retrieval", "A primary key constraint", "A backup file"], "correct": 1},
            {"question": "What does a Foreign Key do?", "options": ["Encrypts a table", "Uniquely identifies a row", "Establishes a link between data in two tables", "Deletes redundant data"], "correct": 2},
            {"question": "What is a transaction in a database?", "options": ["A single logical unit of work", "A network connection", "A table creation command", "A database backup"], "correct": 0},
            {"question": "Which type of database is Neo4j?", "options": ["Relational", "Document", "Graph", "Key-Value"], "correct": 2},
            {"question": "What is horizontal scaling (sharding) in databases?", "options": ["Adding more memory to a server", "Distributing data across multiple machines", "Creating more tables", "Adding more indexes"], "correct": 1},
        ],
        "Web Security": [
            {"question": "What does XSS stand for?", "options": ["Cross-Site Scripting", "XML Security System", "Cross-Server Sync", "Extended Secure Sockets"], "correct": 0},
            {"question": "Which vulnerability occurs when user input is executed as SQL commands?", "options": ["CSRF", "XSS", "SQL Injection", "Clickjacking"], "correct": 2},
            {"question": "What is the purpose of CSRF tokens?", "options": ["To encrypt passwords", "To prevent Cross-Site Request Forgery attacks", "To authorize API access", "To mitigate DDoS attacks"], "correct": 1},
            {"question": "Which hashing algorithm is considered insecure for password storage?", "options": ["bcrypt", "Argon2", "MD5", "PBKDF2"], "correct": 2},
            {"question": "What does HTTPS use to encrypt data?", "options": ["SSL/TLS", "SSH", "FTP", "JWT"], "correct": 0},
            {"question": "What is a 'Man-in-the-Middle' (MitM) attack?", "options": ["An attacker intercepting communication between two parties", "A virus infecting a server", "A technique to guess passwords", "A method to overload a database"], "correct": 0},
            {"question": "Which HTTP header helps prevent clickjacking?", "options": ["Content-Type", "X-Frame-Options", "Set-Cookie", "Authorization"], "correct": 1},
            {"question": "What is the Principle of Least Privilege?", "options": ["Giving users all permissions by default", "Giving users only the minimum permissions necessary", "Encrypting all network traffic", "Disabling all ports"], "correct": 1},
            {"question": "What does CORS policy mitigate?", "options": ["SQL Injection", "Unauthorized cross-origin requests", "Phishing", "Buffer Overflows"], "correct": 1},
            {"question": "What is Multi-Factor Authentication (MFA)?", "options": ["Using multiple passwords", "Requiring two or more verification methods to access an account", "A type of firewall", "A secure hashing algorithm"], "correct": 1},
        ]
    }

    if topic in core_banks:
        return {"questions": core_banks[topic]}

    if not api_key:
        return {
            "questions": [
                {
                    "question": f"What is a key concept in {topic}?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct": 1
                },
                {
                    "question": f"Which of the following is true about {topic}?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct": 2
                }
            ]
        }
        
    prompt = f"""
    You are an expert technical interviewer. Create a 10-question multiple choice assessment on the topic: "{topic}".
    The questions should focus explicitly on Easy to Intermediate difficulty to help the user build confidence.
    
    Return EXCLUSIVELY a valid JSON object in this format:
    {{
        "questions": [
            {{
                "question": "Question text here",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct": 0
            }}
        ]
    }}
    Ensure no markdown backticks.
    """
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error generating assessment: {e}")
        return {"error": "Failed to generate assessment."}
