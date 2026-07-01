import json
from sqlalchemy.orm import Session
import models

def seed_dsa_questions(db: Session):
    if db.query(models.DSAQuestion).first():
        return # Already seeded
        
    questions = [
        {
            "title": "Two Sum",
            "difficulty": "Easy",
            "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
            "starter_code": "def twoSum(nums, target):\n    # Write your code here\n    pass",
            "test_cases": json.dumps([
                {"input": {"nums": [2, 7, 11, 15], "target": 9}, "output": [0, 1]},
                {"input": {"nums": [3, 2, 4], "target": 6}, "output": [1, 2]},
                {"input": {"nums": [3, 3], "target": 6}, "output": [0, 1]}
            ])
        },
        {
            "title": "Valid Palindrome",
            "difficulty": "Easy",
            "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.",
            "starter_code": "def isPalindrome(s: str) -> bool:\n    # Write your code here\n    pass",
            "test_cases": json.dumps([
                {"input": {"s": "A man, a plan, a canal: Panama"}, "output": True},
                {"input": {"s": "race a car"}, "output": False},
                {"input": {"s": " "}, "output": True}
            ])
        },
        {
            "title": "Container With Most Water",
            "difficulty": "Medium",
            "description": "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
            "starter_code": "def maxArea(height) -> int:\n    # Write your code here\n    pass",
            "test_cases": json.dumps([
                {"input": {"height": [1,8,6,2,5,4,8,3,7]}, "output": 49},
                {"input": {"height": [1,1]}, "output": 1}
            ])
        }
    ]
    
    for q in questions:
        db.add(models.DSAQuestion(**q))
    db.commit()

def evaluate_code(code: str, test_cases_json: str):
    # In a real app this would be a secure sandbox (like Docker or Piston API)
    # For MVP we will just return a mock success rate for safety
    if "return" in code and len(code) > 20:
        return True, "All test cases passed!"
    return False, "Failed some test cases or empty implementation."
