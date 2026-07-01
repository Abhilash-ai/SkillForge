import subprocess

async def execute_code(language: str, code: str) -> dict:
    """
    Executes code locally using installed runtimes (Python/Node) to bypass the blocked Piston API.
    """
    if language not in ["python", "javascript"]:
        return {"error": f"Language '{language}' is not supported locally right now. Try Python or JavaScript!"}

    try:
        if language == "python":
            result = subprocess.run(
                ["python", "-c", code],
                capture_output=True,
                text=True,
                timeout=5
            )
        elif language == "javascript":
            result = subprocess.run(
                ["node", "-e", code],
                capture_output=True,
                text=True,
                timeout=5
            )
            
        output = result.stdout
        if result.stderr:
            output += "\n[Error]\n" + result.stderr

        return {
            "language": language,
            "version": "local",
            "output": output.strip(),
            "code": result.returncode
        }
    except subprocess.TimeoutExpired:
        return {"error": "Execution timed out (5s limit)."}
    except FileNotFoundError:
        return {"error": f"Runtime for {language} not found on this machine."}
    except Exception as e:
        return {"error": f"Failed to execute code locally: {str(e)}"}
